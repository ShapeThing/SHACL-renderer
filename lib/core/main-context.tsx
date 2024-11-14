import factory from '@rdfjs/data-model'
import datasetFactory from '@rdfjs/dataset'
import type { BlankNode, DatasetCore, NamedNode } from '@rdfjs/types'
import grapoi, { Grapoi } from 'grapoi'
import { JsonLdContextNormalized } from 'jsonld-context-parser'
import { ReactNode, createContext, useState } from 'react'
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
  context?: Record<string, string>
} & Settings

export type Settings = {
  mode: 'edit' | 'facet' | 'view' | 'inline-edit' | 'data' | 'type'
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
  setPointerByIri: (iri: string) => void
  originalInput: MainContextInput
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
  languages: {},
  setPointerByIri: (iri: string) => null,
  originalInput: null as unknown as MainContextInput
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
  if (givenTargetClass) {
    shapePointers = shapePointers.hasOut(sh('targetClass'), givenTargetClass)
    if (![...shapePointers].length)
      throw new Error(`No shape found for the specified target class ${givenTargetClass.value}`)
  }

  const localShapeName =
    shapes instanceof URL && shapes?.toString().includes('#') ? shapes?.toString().split('#').pop() : false
  if (localShapeName)
    shapePointers = shapePointers.filter(pointer => pointer.term.value.split(/\/|\#/g).pop() === localShapeName)

  const shapePointer = shapeSubject?.toString()
    ? shapePointers.filter(pointer => pointer.term.value === shapeSubject?.toString()) ?? [...shapePointers].at(0)!
    : [...shapePointers].at(0)!
  const targetClass: NamedNode | undefined = givenTargetClass

  if (!shapePointer) throw new Error('No shape pointer')

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
export const initContext = async (originalInput: MainContextInput): Promise<MainContext> => {
  const {
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
  } = originalInput

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
    setPointerByIri: (iri: string) => null,
    originalInput,
    ...settings
  }
}

export function MainContextProvider({ children, context: givenContext }: MainContextProviderProps) {
  const [context, setContext] = useState(givenContext)

  const setPointerByIri = (iri: string) => {
    initContext({ ...givenContext.originalInput, shapeSubject: new URL(iri) }).then(setContext)
  }

  return context ? (
    <mainContext.Provider value={{ ...context, setPointerByIri }}>
      <LanguageProvider>{children}</LanguageProvider>
    </mainContext.Provider>
  ) : null
}
