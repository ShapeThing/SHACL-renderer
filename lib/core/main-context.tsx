import factory from '@rdfjs/data-model'
import datasetFactory from '@rdfjs/dataset'
import DatasetCoreConstructor from '@rdfjs/dataset/DatasetCore'
import fetch from '@rdfjs/fetch'
import { DatasetResponse } from '@rdfjs/fetch-lite'
import type { BlankNode, DatasetCore, NamedNode } from '@rdfjs/types'
import grapoi from 'grapoi'
import { Parser } from 'n3'
import { ReactNode, createContext, use, useState } from 'react'
import { rdf, sh } from './namespaces'

export type MainContextInput = {
  shapes: URL | DatasetCore | string
  data?: URL | DatasetCore | string
  subject?: NamedNode | BlankNode
  targetClass?: NamedNode
}

type MainContext = {
  shapes: DatasetCore
  data: DatasetCore
  subject: NamedNode | BlankNode
  targetClass?: NamedNode
  shapePointer: GrapoiPointer
  shapePointers: GrapoiPointer
}

export const mainContext = createContext<MainContext>({
  shapes: datasetFactory.dataset(),
  data: datasetFactory.dataset(),
  subject: factory.blankNode(),
  targetClass: undefined,
  shapePointer: undefined as unknown as GrapoiPointer,
  shapePointers: undefined as unknown as GrapoiPointer
})

type MainContextProviderProps = MainContextInput & {
  children?: ReactNode
}

export const resolveRdfInput = async (input: URL | DatasetCore | string): Promise<DatasetCore> => {
  if (input instanceof URL) {
    const response = (await fetch(input)) as DatasetResponse<DatasetCore>
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

export const initContext = async ({ shapes, data, subject, targetClass }: MainContextInput): Promise<MainContext> => {
  const resolvedShapes = await resolveRdfInput(shapes)

  const pointer = grapoi({ dataset: resolvedShapes, factory })
  let shapePointers = pointer.hasOut(rdf('type'), sh('NodeShape'))
  if (targetClass) shapePointers = shapePointers.hasOut(sh('targetClass'), targetClass)

  return {
    shapes: resolvedShapes,
    data: data ? await resolveRdfInput(data) : datasetFactory.dataset(),
    subject: subject ?? factory.blankNode(),
    targetClass,
    shapePointer: [...shapePointers].at(0)!,
    shapePointers
  }
}

export function MainContextProvider({ children, ...input }: MainContextProviderProps) {
  const [contextPromise] = useState(() => initContext(input))
  const context = use(contextPromise)
  return <mainContext.Provider value={context}>{children}</mainContext.Provider>
}
