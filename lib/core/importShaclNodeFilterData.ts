import { constructQuery } from '@hydrofoil/shape-to-query'
import datasetFactory from '@rdfjs/dataset'
import DatasetCore from '@rdfjs/dataset/DatasetCore'
import { NamedNode, Quad } from '@rdfjs/types'
import clownFace, { GraphPointer } from 'clownface'
import { Store } from 'n3'
import Parser from 'n3/src/N3Parser.js'

type Input = {
  focusNode?: NamedNode
  shapeQuads: Quad[]
  limit?: number
  endpoint?: string
  dataset: DatasetCore
  searchTerm?: string
} & ({ endpoint: string } | { dataset: DatasetCore })

export const importShaclNodeFilterData = async ({
  focusNode,
  endpoint,
  dataset,
  shapeQuads,
  limit,
  searchTerm
}: Input) => {
  const filterShapeDataset = datasetFactory.dataset([...shapeQuads])
  const subject = [...filterShapeDataset]?.[0]?.subject

  if (!subject) return datasetFactory.dataset()

  const shape = clownFace({ dataset: filterShapeDataset, term: subject }) as GraphPointer
  let constructPart = constructQuery(shape, { focusNode }).trim()

  const query = `${constructPart.substring(0, constructPart.length - 1)}${
    searchTerm
      ? `\n?resource1 rdfs:label ?label . FILTER(contains(lcase(?label),"""${searchTerm.toLocaleLowerCase()}"""))\n`
      : ''
  }}
  ${limit ? `limit ${limit}` : ''}
  `
  const returnDataset = datasetFactory.dataset()

  if (endpoint) {
    const body = new URLSearchParams()
    body.set('query', query)

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        accept: 'text/turtle'
      },
      body
    })

    const parser = new Parser()
    const quads = await parser.parse(await response.text())
    for (const quad of quads) returnDataset.add(quad)
    return returnDataset
  } else {
    const { QueryEngine } = await import('@comunica/query-sparql-rdfjs')
    const queryEngine = new QueryEngine()
    const quadsStream = await queryEngine.queryQuads(query, { sources: [new Store([...dataset])] })
    return datasetFactory.dataset(await quadsStream.toArray())
  }
}
