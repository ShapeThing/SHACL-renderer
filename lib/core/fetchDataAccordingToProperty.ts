import { ProxyHandlerStatic } from '@comunica/actor-http-proxy'
import { constructQuery } from '@hydrofoil/shape-to-query'
import datasetFactory from '@rdfjs/dataset'
import { DatasetCore, NamedNode } from '@rdfjs/types'
import clownFace, { GraphPointer } from 'clownface'
import { Grapoi } from 'grapoi'
import { Parser, Store } from 'n3'
import { constructQueryToSearch } from '../helpers/constructQueryToSearch'
import { getPurposePredicates } from '../helpers/getPurposePredicates'
import { nonNullable } from '../helpers/nonNullable'
import { outAll } from '../helpers/outAll'
import { sh } from './namespaces'
import { needsHttpProxy } from './needsHttpProxy'

type Input = {
  nodeShape: Grapoi
  term?: NamedNode
  endpoint?: string
  dataset?: DatasetCore
  searchTerm?: string
  limit?: number
  fetch?: (typeof globalThis)['fetch']
}

export const fetchDataAccordingToProperty = async ({
  nodeShape,
  term,
  endpoint,
  dataset,
  searchTerm,
  limit = 10,
  fetch
}: Input) => {
  const shapeQuads = outAll(nodeShape.out().distinct().out())
  const shapeDataset = datasetFactory.dataset(shapeQuads)
  const shape = clownFace({ dataset: shapeDataset, term: shapeQuads[0].subject }) as GraphPointer

  const mustUseFocusTerm = typeof searchTerm === 'string' && !searchTerm ? false : true

  const dataConstructQuery = constructQuery(shape, { focusNode: mustUseFocusTerm ? term : undefined }).trim()
  const labelPredicates = getPurposePredicates(nodeShape.out(sh('node')), 'label')
  const query =
    searchTerm !== undefined
      ? constructQueryToSearch(dataConstructQuery, searchTerm, labelPredicates, limit)
      : dataConstructQuery

  const termNeedsProxy = term?.value ? await needsHttpProxy(term.value, fetch) : false
  const store = dataset ? new Store([...dataset]) : undefined
  const sources = [endpoint, endpoint ? undefined : store, endpoint ? undefined : term?.value].filter(nonNullable)

  // If this is a clean SPARQL endpoint.
  if (endpoint) {
    const body = new URLSearchParams()
    body.set('query', query)

    const response = await (fetch ?? globalThis['fetch'])(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        accept: 'text/turtle'
      },
      body
    })

    const parser = new Parser()
    return await parser.parse(await response.text())
  }

  const { QueryEngine } = await import('@comunica/query-sparql')
  const queryEngine = new QueryEngine()
  const quadsStream = await queryEngine.queryQuads(query, {
    /** @ts-expect-error the types of Comunica do not match */
    sources,
    lenient: true,
    // TODO no fetch, the cachedFetch does not work with comunica.
    httpProxyHandler: termNeedsProxy ? new ProxyHandlerStatic(`https://corsproxy.io/?`) : undefined
  })
  return (await quadsStream.toArray()) ?? []
}
