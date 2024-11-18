import datasetFactory from '@rdfjs/dataset'
import type { DatasetCore } from '@rdfjs/types'
import Parser from 'n3/src/N3Parser.js'
import { cachedFetch } from '../helpers/cachedFetch'

export const resolveRdfInput = async (
  input: URL | DatasetCore | string
): Promise<{
  dataset: DatasetCore
  prefixes: Record<string, string>
}> => {
  const dummyDataset = datasetFactory.dataset()
  if (input?.constructor && input?.constructor === dummyDataset.constructor)
    return {
      dataset: input as DatasetCore,
      prefixes: {}
    }

  let originalUrl: string | undefined = undefined
  if (input instanceof URL) {
    const response = await cachedFetch(input)

    if (!['text/turtle'].includes(response.headers.get('content-type').split(';')[0] ?? ''))
      throw new Error('Unexpected mime type')

    originalUrl = input.toString()
    input = await response.text()
  }

  if (typeof input === 'string') {
    const FinalParser = Parser.default ? Parser.default : Parser
    const parser = new FinalParser({ baseIRI: originalUrl })

    const quads = await parser.parse(input)
    return {
      dataset: datasetFactory.dataset(quads),
      prefixes: parser._prefixes
    }
  }

  throw new Error('Unexpected type of data')
}
