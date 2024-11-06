import { ProxyHandlerStatic } from '@comunica/actor-http-proxy'
import { QueryEngine } from '@comunica/query-sparql'
import { constructQuery } from '@hydrofoil/shape-to-query'
import datasetFactory from '@rdfjs/dataset'
import { DatasetCore, NamedNode } from '@rdfjs/types'
import clownFace, { GraphPointer } from 'clownface'
import { Grapoi } from 'grapoi'
import { Store } from 'n3'
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
}

export const fetchDataAccordingToProperty = async ({
  nodeShape,
  term,
  endpoint,
  dataset,
  searchTerm,
  limit = 10
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

  const queryEngine = new QueryEngine()
  const termNeedsProxy = term?.value ? await needsHttpProxy(term.value) : false
  const store = dataset ? new Store([...dataset]) : undefined
  const sources = [endpoint, endpoint ? undefined : store, endpoint ? undefined : term?.value].filter(nonNullable)

  const quadsStream = await queryEngine.queryQuads(query, {
    /** @ts-ignore */
    sources,
    lenient: true,
    httpProxyHandler: termNeedsProxy ? new ProxyHandlerStatic(`https://corsproxy.io/?`) : undefined
  })
  return quadsStream.toArray() ?? []
}
