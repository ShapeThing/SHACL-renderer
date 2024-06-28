import datasetFactory from '@rdfjs/dataset'
import DatasetCoreConstructor from '@rdfjs/dataset/DatasetCore'
import { DatasetCore } from '@rdfjs/types'
import { Parser } from 'n3'
import { cachedFetch } from '../helpers/cachedFetch'

export const resolveRdfInput = async (
  input: URL | DatasetCore | string
): Promise<{
  dataset: DatasetCore
  prefixes: Record<string, string>
}> => {
  if (input instanceof DatasetCoreConstructor)
    return {
      dataset: input,
      prefixes: {}
    }

  if (input instanceof URL && ['.ttl', '.trig'].some(extension => input.toString().includes(extension))) {
    const response = await cachedFetch(input)
    input = await response.text()
  }

  if (typeof input === 'string') {
    const parser = new Parser()
    const quads = await parser.parse(input)
    return {
      dataset: datasetFactory.dataset(quads),
      /** @ts-ignore I am a little bit lazy, we can also do a callback but this is easier */
      prefixes: parser._prefixes
    }
  }

  throw new Error('Unexpected type of data')
}
