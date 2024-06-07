import factory from '@rdfjs/data-model'
import datasetFactory from '@rdfjs/dataset'
import type { BlankNode, DatasetCore, NamedNode } from '@rdfjs/types'
import grapoi from 'grapoi'
import { ReactNode, createContext, use } from 'react'
import { resolveRdfInput } from '../helpers/resolveRdfInput'
import { rdf, sh } from './namespaces'

export type MainContextInput = {
  shapes: URL | DatasetCore | string
  data?: URL | DatasetCore | string
  facetSearchData?: URL | DatasetCore | string
  subject?: NamedNode | BlankNode
  targetClass?: NamedNode
} & Settings

export type Settings = {
  mode: 'edit' | 'facet' | 'view' | 'inline-edit'
}

type MainContext = {
  shapes: DatasetCore
  data: DatasetCore
  facetSearchData: DatasetCore
  subject: NamedNode | BlankNode
  targetClass?: NamedNode
  shapePointer: GrapoiPointer
  shapePointers: GrapoiPointer
  dataPointer: GrapoiPointer
  facetSearchDataPointer: GrapoiPointer
} & Settings

export const mainContext = createContext<MainContext>({
  shapes: datasetFactory.dataset(),
  data: datasetFactory.dataset(),
  facetSearchData: datasetFactory.dataset(),
  subject: factory.blankNode(),
  targetClass: undefined,
  shapePointer: undefined as unknown as GrapoiPointer,
  shapePointers: undefined as unknown as GrapoiPointer,
  dataPointer: undefined as unknown as GrapoiPointer,
  facetSearchDataPointer: undefined as unknown as GrapoiPointer,
  mode: 'edit'
})

type MainContextProviderProps = {
  children?: ReactNode
  contextPromise: Promise<MainContext>
}

export const initContext = async ({
  shapes,
  data,
  facetSearchData,
  subject,
  targetClass: givenTargetClass,
  ...settings
}: MainContextInput): Promise<MainContext> => {
  const resolvedShapes = await resolveRdfInput(shapes)
  const rootShapePointer = grapoi({ dataset: resolvedShapes, factory })
  let shapePointers = rootShapePointer.hasOut(rdf('type'), sh('NodeShape'))
  if (givenTargetClass) shapePointers = shapePointers.hasOut(sh('targetClass'), givenTargetClass)
  const dataset = data ? await resolveRdfInput(data) : datasetFactory.dataset()
  if (!subject) {
    const firstQuad = [...dataset]?.[0]
    if (firstQuad) {
      subject = firstQuad.subject as NamedNode
    } else {
      subject = factory.blankNode()
    }
  }
  const dataPointer = grapoi({ dataset, factory, term: subject })

  const shapePointer = [...shapePointers].at(0)!
  const targetClass = givenTargetClass ?? shapePointer.out(sh('targetClass')).term

  const facetSearchDataset = facetSearchData ? await resolveRdfInput(facetSearchData) : datasetFactory.dataset()
  const facetSearchDataPointer = grapoi({ dataset: facetSearchDataset, factory }).hasOut(rdf('type'), targetClass)

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
    ...settings
  }
}

export function MainContextProvider({ children, contextPromise }: MainContextProviderProps) {
  const context = use(contextPromise)
  return <mainContext.Provider value={context}>{children}</mainContext.Provider>
}
