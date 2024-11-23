import datasetFactory from '@rdfjs/dataset'
import type { DatasetCore, Quad } from '@rdfjs/types'
import Parser from 'n3/src/N3Parser.js'
import { owl } from './namespaces'

export const resolveRdfInput = async (
  input: URL | DatasetCore | string,
  allowImports: boolean = false,
  fetch?: (typeof globalThis)['fetch']
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
    originalUrl = input.toString()

    if (input.protocol === 'file:') {
      const fs = await import('fs/promises')
      input = await fs.readFile(input.pathname, 'utf8')
    } else {
      const response = await (fetch ?? globalThis.fetch)(input)

      if (!['text/turtle'].includes(response.headers.get('content-type')?.split(';')[0] ?? ''))
        throw new Error('Unexpected mime type')

      input = await response.text()
    }
  }

  if (typeof input === 'string') {
    const FinalParser = Parser.default ? Parser.default : Parser
    const parser = new FinalParser({ baseIRI: originalUrl ?? '' })

    const quads: Quad[] = await parser.parse(input)

    if (allowImports) {
      const owlImports = quads.filter(quad => quad.predicate.equals(owl('imports'))).map(quad => quad.object)

      for (const owlImport of owlImports) {
        const isNode = import.meta?.url?.startsWith(`file://`)
        const url = isNode
          ? new URL(owlImport.value, `file://${process.cwd()}`)
          : new URL(owlImport.value, location.toString())
        const importedData = await resolveRdfInput(url, allowImports, fetch ?? globalThis.fetch)
        quads.push(...[...importedData.dataset])
      }
    }

    return {
      dataset: datasetFactory.dataset(quads),
      prefixes: parser._prefixes
    }
  }

  throw new Error('Unexpected type of data')
}
