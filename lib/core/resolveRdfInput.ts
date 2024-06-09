import datasetFactory from '@rdfjs/dataset'
import DatasetCoreConstructor from '@rdfjs/dataset/DatasetCore'
import { DatasetCore } from '@rdfjs/types'
import { Parser } from 'n3'

export const resolveRdfInput = async (input: URL | DatasetCore | string): Promise<DatasetCore> => {
  if (input instanceof DatasetCoreConstructor) return input

  if (input instanceof URL && ['.ttl', '.trig'].some(extension => input.toString().includes(extension))) {
    const response = await fetch(input)
    input = await response.text()
  }

  if (typeof input === 'string') {
    const parser = new Parser()
    const quads = await parser.parse(input)
    return datasetFactory.dataset(quads)
  }

  throw new Error('Unexpected type of data')
}
