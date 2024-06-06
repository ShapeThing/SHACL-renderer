import factory from '@rdfjs/data-model'
import datasetFactory from '@rdfjs/dataset'
import DatasetCoreConstructor from '@rdfjs/dataset/DatasetCore'
import rdfFetch from '@rdfjs/fetch'
import { DatasetResponse } from '@rdfjs/fetch-lite'
import type { BlankNode, DatasetCore, NamedNode } from '@rdfjs/types'
import grapoi from 'grapoi'
import { Parser } from 'n3'
import { ReactNode, createContext, use } from 'react'
import { rdf, sh } from './namespaces'

export type MainContextInput = {
  shapes: URL | DatasetCore | string
  data?: URL | DatasetCore | string
  subject?: NamedNode | BlankNode
  targetClass?: NamedNode
} & Settings

export type Settings = {
  showAdditionalPropertiesInOpenNodes?: boolean
  mode: 'edit' | 'facet' | 'view' | 'inline-edit'
}

type MainContext = {
  shapes: DatasetCore
  data: DatasetCore
  subject: NamedNode | BlankNode
  targetClass?: NamedNode
  shapePointer: GrapoiPointer
  shapePointers: GrapoiPointer
  dataPointer: GrapoiPointer
} & Settings

export const mainContext = createContext<MainContext>({
  shapes: datasetFactory.dataset(),
  data: datasetFactory.dataset(),
  subject: factory.blankNode(),
  targetClass: undefined,
  shapePointer: undefined as unknown as GrapoiPointer,
  shapePointers: undefined as unknown as GrapoiPointer,
  dataPointer: undefined as unknown as GrapoiPointer,
  mode: 'edit'
})

type MainContextProviderProps = {
  children?: ReactNode
  contextPromise: Promise<MainContext>
}

export const resolveRdfInput = async (input: URL | DatasetCore | string): Promise<DatasetCore> => {
  if (input instanceof URL) {
    const response = (await rdfFetch(input)) as DatasetResponse<DatasetCore>
    return response.dataset()
  }

  if (input instanceof DatasetCoreConstructor) return input

  if (typeof input === 'string') {
    const parser = new Parser()
    const quads = await parser.parse(input)
    return datasetFactory.dataset(quads)
  }

  throw new Error('Unexpected type of data')
}

export const initContext = async ({
  shapes,
  data,
  subject,
  targetClass,
  ...settings
}: MainContextInput): Promise<MainContext> => {
  const resolvedShapes = await resolveRdfInput(shapes)
  const rootShapePointer = grapoi({ dataset: resolvedShapes, factory })
  let shapePointers = rootShapePointer.hasOut(rdf('type'), sh('NodeShape'))
  if (targetClass) shapePointers = shapePointers.hasOut(sh('targetClass'), targetClass)
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

  return {
    shapes: resolvedShapes,
    data: dataset,
    dataPointer,
    subject,
    targetClass,
    shapePointer: [...shapePointers].at(0)!,
    shapePointers,
    ...settings
  }
}

export function MainContextProvider({ children, contextPromise }: MainContextProviderProps) {
  const context = use(contextPromise)
  return <mainContext.Provider value={context}>{children}</mainContext.Provider>
}
