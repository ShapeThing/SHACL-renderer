import factory from '@rdfjs/data-model'
import datasetFactory from '@rdfjs/dataset'
import type { BlankNode, DatasetCore, NamedNode } from '@rdfjs/types'
import grapoi from 'grapoi'
import { JsonLdContextNormalized } from 'jsonld-context-parser/lib/JsonLdContextNormalized'
import { ReactNode, createContext } from 'react'
import { getShapeSkeleton } from './getShapeSkeleton'
import { rdf, sh } from './namespaces'
import { resolveRdfInput } from './resolveRdfInput'

export type MainContextInput = {
  shapes: URL | DatasetCore | string
  shapeSubject?: URL | string
  data?: URL | DatasetCore | string
  facetSearchData?: URL | DatasetCore | string
  subject?: NamedNode | BlankNode
  targetClass?: NamedNode
} & Settings

export type Settings = {
  mode: 'edit' | 'facet' | 'view' | 'inline-edit'
}

type Grapoi = ReturnType<typeof grapoi>

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
} & Settings

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
  jsonLdContext: new JsonLdContextNormalized({})
})

type MainContextProviderProps = {
  children?: ReactNode
  context: MainContext
}

export const initContext = async ({
  shapes,
  data,
  facetSearchData,
  subject,
  targetClass: givenTargetClass,
  mode,
  shapeSubject,
  ...settings
}: MainContextInput): Promise<MainContext> => {
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

  const localShapeName = shapes.toString().split(/\/|\#/g).pop()
  if (localShapeName) {
    shapePointers = shapePointers.filter(pointer => pointer.term.value.split(/\/|\#/g).pop() === localShapeName)
  }

  const resolvedData = data ? await resolveRdfInput(data) : null
  let dataset = resolvedData ? resolvedData.dataset : datasetFactory.dataset()

  if (!subject) {
    const firstQuad = [...dataset]?.[0]
    if (firstQuad) {
      subject = firstQuad.subject as NamedNode
    } else {
      subject = factory.blankNode()
    }
  }

  // TODO in the future we could make it possible to select a specific shape.
  const shapePointer = shapeSubject?.toString()
    ? shapePointers.filter(pointer => pointer.term.value === shapeSubject?.toString()) ?? [...shapePointers].at(0)!
    : [...shapePointers].at(0)!
  const targetClass: NamedNode = givenTargetClass ?? shapePointer.out(sh('targetClass')).term

  let dataPointer = grapoi({ dataset, factory, term: subject })

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
    subject,
    targetClass,
    facetSearchData: facetSearchDataset,
    shapePointer,
    shapePointers,
    facetSearchDataPointer,
    jsonLdContext: new JsonLdContextNormalized({ ...(resolvedData?.prefixes ?? {}) }),
    mode,
    ...settings
  }
}

export function MainContextProvider({ children, context }: MainContextProviderProps) {
  return context ? <mainContext.Provider value={context}>{children}</mainContext.Provider> : null
}
