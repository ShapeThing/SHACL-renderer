import { constructQuery } from '@hydrofoil/shape-to-query'
import datasetFactory from '@rdfjs/dataset'
import { DatasetCore, Quad } from '@rdfjs/types'
import clownFace, { GraphPointer } from 'clownface'
import { Grapoi } from 'grapoi'
import Parser from 'n3/src/N3Parser.js'
import parsePath from 'shacl-engine/lib/parsePath'
import { sh } from './namespaces'

/**
 * Used when a sh:node has a sibling stsr:endpoint;
 */
export const importShaclNodeFilterData = async ({
  property,
  dataPointer,
  endpoint,
  dataset,
  shapeQuads,
  limit,
  searchTerm
}: {
  property: Grapoi
  dataPointer: Grapoi
  endpoint: string
  dataset?: DatasetCore
  shapeQuads: Quad[]
  limit?: number
  searchTerm?: string
}) => {
  const path = parsePath(property.out(sh('path')))
  const focusNode = dataPointer.executeAll(path)
  const filterShapeDataset = datasetFactory.dataset([...shapeQuads])

  const shape = clownFace({ dataset: filterShapeDataset, term: [...filterShapeDataset][0].subject }) as GraphPointer
  let constructPart = constructQuery(shape, { focusNode: focusNode.term }).trim()

  const query = `${constructPart.substring(0, constructPart.length - 1)}${
    searchTerm ? `\nFILTER(contains(lcase(?resource2),"""${searchTerm.toLocaleLowerCase()}"""))\n` : ''
  }}
  ${limit ? `limit ${limit}` : ''}
  `

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

  if (!dataset) dataset = datasetFactory.dataset()

  const parser = new Parser()
  const quads = await parser.parse(await response.text())
  for (const quad of quads) dataset.add(quad)
  return dataset
}
