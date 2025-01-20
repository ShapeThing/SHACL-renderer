import { DatasetCore, NamedNode } from '@rdfjs/types'
import { Grapoi } from 'grapoi'
import { Store } from 'n3'
import parsePath from '../../helpers/parsePath'
import { sh, stsr } from '../namespaces'

export const fetchAdditionalData = async (
  shapePointer: Grapoi,
  dataset: DatasetCore,
  dataPointer: Grapoi,
  fetch: (typeof globalThis)['fetch'],
  stores?: Record<string, Store>
) => {
  const properties = shapePointer.out(sh('property'))

  for (const property of properties) {
    const endpoint = property.out(stsr('endpoint')).value

    if (endpoint) {
      const fetchDataAccordingToProperty = (await import('../fetchDataAccordingToProperty'))
        .fetchDataAccordingToProperty
      const path = parsePath(property.out(sh('path')))
      const dataItemPointer = dataPointer.executeAll(path)
      const terms = dataItemPointer.terms

      const promises = terms.map(async term => {
        const additionalQuads = await fetchDataAccordingToProperty({
          nodeShape: property,
          term: term as NamedNode,
          endpoint,
          fetch,
          stores
        })
        for (const quad of additionalQuads) dataset.add(quad)
      })

      await Promise.allSettled(promises)
    }
  }
}
