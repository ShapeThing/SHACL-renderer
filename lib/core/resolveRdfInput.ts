import factory from '@rdfjs/data-model'
import datasetFactory from '@rdfjs/dataset'
import type { DatasetCore, Quad, Quad_Object, Quad_Subject } from '@rdfjs/types'
import grapoi, { Grapoi } from 'grapoi'
import Parser from 'n3/src/N3Parser.js'
import { nonNullable } from '../helpers/nonNullable'
import { owl, rdfs, sh, stsr } from './namespaces'

export const resolveRdfInput = async (
  input: URL | DatasetCore | string,
  allowImports: boolean = false,
  fetch?: (typeof globalThis)['fetch']
): Promise<{
  dataset: DatasetCore
  prefixes: Record<string, string>
  containsRelativeReferences?: boolean
}> => {
  const dummyDataset = datasetFactory.dataset()
  if (input?.constructor && input?.constructor === dummyDataset.constructor)
    return {
      dataset: input as DatasetCore,
      prefixes: {}
    }

  let containsRelativeReferences = false
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

      if (input.includes('<>')) containsRelativeReferences = true
    }
  }

  if (typeof input === 'string') {
    const FinalParser = Parser.default ? Parser.default : Parser
    const parser = new FinalParser({ baseIRI: originalUrl ?? '' })

    const quads: Quad[] = await parser.parse(input)
    const dataset = datasetFactory.dataset(quads)

    if (allowImports) {
      const owlImports = quads.filter(quad => quad.predicate.equals(owl('imports'))).map(quad => quad.object)

      for (const owlImport of owlImports) {
        const isNode = import.meta?.url?.startsWith(`file://`)
        const url = isNode
          ? new URL(owlImport.value, `file://${process.cwd()}`)
          : new URL(owlImport.value, location.toString())
        const importedData = await resolveRdfInput(url, allowImports, fetch ?? globalThis.fetch)
        for (const quad of [...importedData.dataset]) dataset.add(quad)
      }

      // Dynamic SHACL, https://datashapes.org/dynamic.html 2.2 with the addition of an endpoint.
      // This works but is quite slow.
      // An alternative is owl:imports and referencing the list, like is done in countries.ttl and person.ttl.
      const datasetPointer = grapoi({ dataset, factory })
      const dynamicIns = datasetPointer.node().out(sh('in')).hasOut(sh('select')).hasOut(stsr('endpoint'))

      if (dynamicIns.ptrs.length) {
        const { QueryEngine } = await import('@comunica/query-sparql')
        const engine = new QueryEngine()

        const dynamicShaclPromises = [...dynamicIns].map(async (dynamicIn: Grapoi) => {
          const query = dynamicIn.out(sh('select')).value
          const endpoint = dynamicIn.out(stsr('endpoint')).term

          let source = endpoint.value
          if (!source.includes('sparql')) {
            const response = await (fetch ?? globalThis.fetch)(source)
            const contents = await response.text()
            source = {
              type: 'serialized',
              value: contents,
              mediaType: 'text/turtle',
              baseIRI: source
            }
          }

          const response = await engine.queryBindings(query, { sources: [source], fetch: fetch ?? globalThis.fetch })
          const bindings = await response.toArray()

          const values = bindings.map(binding => binding.get('value'))
          const labelQuads = bindings
            .map(binding => {
              if (!binding.get('value') || !binding.get('label')) return
              return factory.quad(
                binding.get('value') as Quad_Subject,
                rdfs('label'),
                binding.get('label') as Quad_Object
              )
            })
            .filter(nonNullable)

          for (const quad of labelQuads) dataset.add(quad)

          const dedupedValues = [...new Map(values.map(value => [value?.value, value])).values()]
          const property = dynamicIn.in(sh('in'))

          dynamicIn.deleteOut(stsr('endpoint'))
          dynamicIn.deleteOut(sh('select'))
          property.deleteOut(sh('in'))
          property.deleteList(sh('in'))
          property.addList(sh('in'), dedupedValues.filter(nonNullable))
        })

        await Promise.all(dynamicShaclPromises)
      }
    }

    return {
      dataset,
      prefixes: parser._prefixes,
      containsRelativeReferences
    }
  }

  throw new Error('Unexpected type of data')
}
