import factory from '@rdfjs/data-model'
import datasetFactory from '@rdfjs/dataset'
import type { BlankNode, DatasetCore, NamedNode } from '@rdfjs/types'
import grapoi, { Grapoi } from 'grapoi'
import { JsonLdContextNormalized } from 'jsonld-context-parser/lib/JsonLdContextNormalized'
import { ReactNode, createContext } from 'react'
import { getShapeSkeleton } from './getShapeSkeleton'
import LanguageProvider from './language-context'
import { rdf, sh } from './namespaces'
import { resolveRdfInput } from './resolveRdfInput'

export type MainContextInput = {
  shapes: URL | DatasetCore | string
  shapeSubject?: URL | string
  data?: URL | DatasetCore | string
  languageMode?: 'tabs' | 'individual'
  facetSearchData?: URL | DatasetCore | string
  subject?: NamedNode | BlankNode
  targetClass?: NamedNode
  languages?: Record<string, string>
} & Settings

export type Settings = {
  mode: 'edit' | 'facet' | 'view' | 'inline-edit' | 'data'
}

export type MainContext = {
  shapes: DatasetCore
  data: DatasetCore
  facetSearchData: DatasetCore
  subject: NamedNode | BlankNode
  targetClass?: NamedNode
  shapePointer: Grapoi
  shapePointers: Grapoi
  dataPointer: Grapoi
  facetSearchDataPointer: Grapoi
  jsonLdContext: JsonLdContextNormalized
  languageMode: 'tabs' | 'individual'
  languages: Record<string, string>
} & Settings

// The default context because react needs it this way.
export const mainContext = createContext<MainContext>({
  shapes: datasetFactory.dataset(),
  data: datasetFactory.dataset(),
  facetSearchData: datasetFactory.dataset(),
  subject: factory.blankNode(),
  targetClass: undefined,
  shapePointer: undefined as unknown as Grapoi,
  shapePointers: undefined as unknown as Grapoi,
  dataPointer: undefined as unknown as Grapoi,
  facetSearchDataPointer: undefined as unknown as Grapoi,
  mode: 'edit',
  jsonLdContext: new JsonLdContextNormalized({}),
  languageMode: 'tabs',
  languages: {}
})

type MainContextProviderProps = {
  children?: ReactNode
  context: MainContext
}

/**
 * Fetches the data, returns an empty dataset if no data was given.
 */
const getData = async (dataInput?: URL | DatasetCore | string, subject?: NamedNode | BlankNode) => {
  const resolvedData = dataInput ? await resolveRdfInput(dataInput) : null
  let dataset = resolvedData ? resolvedData.dataset : datasetFactory.dataset()

  if (!subject && dataInput instanceof URL) {
    const localDataName = dataInput?.toString().split('#').pop()
    if (localDataName) subject = factory.namedNode(dataInput.toString())
  }

  const firstQuad = [...dataset]?.[0]
  if (!subject && firstQuad) {
    subject = firstQuad.subject as NamedNode
  } else if (!subject) {
    subject = factory.blankNode()
  }

  return {
    dataPointer: grapoi({ dataset, factory, term: subject }),
    prefixes: resolvedData?.prefixes,
    subject,
    dataset
  }
}

/**
 * Fetches the shape part, can return a generic shape if none was given
 */
const getShapes = async (
  shapes: URL | DatasetCore | string,
  givenTargetClass?: NamedNode,
  shapeSubject?: URL | string
) => {
  const { dataset: resolvedShapes } = shapes
    ? await resolveRdfInput(shapes)
    : {
        dataset: datasetFactory.dataset([
          factory.quad(factory.namedNode(''), rdf('type'), sh('NodeShape')),
          factory.quad(factory.namedNode(''), sh('targetClass'), givenTargetClass!)
        ])
      }
  const rootShapePointer = grapoi({ dataset: resolvedShapes, factory })
  let shapePointers = rootShapePointer.hasOut(rdf('type'), sh('NodeShape'))
  if (givenTargetClass) shapePointers = shapePointers.hasOut(sh('targetClass'), givenTargetClass)

  const localShapeName = shapes?.toString().includes('#') ? shapes?.toString().split('#').pop() : false
  if (localShapeName)
    shapePointers = shapePointers.filter(pointer => pointer.term.value.split(/\/|\#/g).pop() === localShapeName)

  const shapePointer = shapeSubject?.toString()
    ? shapePointers.filter(pointer => pointer.term.value === shapeSubject?.toString()) ?? [...shapePointers].at(0)!
    : [...shapePointers].at(0)!
  const targetClass: NamedNode = givenTargetClass ?? shapePointer.out(sh('targetClass')).term

  return {
    shapePointer,
    targetClass,
    shapePointers,
    resolvedShapes
  }
}

/**
 * Creates a new main context. This is a promise, so it should be awaited.
 */
export const initContext = async ({
  shapes,
  data,
  facetSearchData,
  subject,
  targetClass: givenTargetClass,
  mode,
  languageMode,
  shapeSubject,
  languages,
  ...settings
}: MainContextInput): Promise<MainContext> => {
  let { dataset, dataPointer, prefixes, subject: finalSubject } = await getData(data, subject)
  let { shapePointer, resolvedShapes, targetClass, shapePointers } = await getShapes(
    shapes,
    givenTargetClass,
    shapeSubject
  )

  // This is only for facets, it contains a dataset that we will filter through.
  const facetSearchDataset = facetSearchData
    ? (await resolveRdfInput(facetSearchData)).dataset
    : datasetFactory.dataset()
  const facetSearchDataPointer = grapoi({ dataset: facetSearchDataset, factory })
    .hasOut(rdf('type'), targetClass)
    .distinct()

  if (mode === 'facet') {
    // Extract the bare essentials for a shape so that facets can run and add their filters to it.
    dataset = getShapeSkeleton(shapePointer)
    dataPointer = grapoi({ dataset, factory, term: shapePointer.term })
  }

  return {
    shapes: resolvedShapes,
    data: dataset,
    dataPointer,
    subject: finalSubject,
    targetClass,
    facetSearchData: facetSearchDataset,
    shapePointer,
    languageMode: languageMode ?? 'tabs',
    shapePointers,
    facetSearchDataPointer,
    languages: languages ?? {},
    jsonLdContext: new JsonLdContextNormalized({ ...(prefixes ?? {}) }),
    mode,
    ...settings
  }
}

export function MainContextProvider({ children, context }: MainContextProviderProps) {
  return context ? (
    <mainContext.Provider value={{ ...context }}>
      <LanguageProvider>{children}</LanguageProvider>
    </mainContext.Provider>
  ) : null
}
