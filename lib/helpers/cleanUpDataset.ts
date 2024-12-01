import { DatasetCore, Quad } from '@rdfjs/types'
import { TouchableTerm } from './touchableRdf'

export const cleanUpDataset = (dataset: DatasetCore) => {
  const quadsToDelete = [...dataset]
    .filter(quad => (quad.object as TouchableTerm).touched === false)
    .filter(quad => {
      if (quad.object.termType === 'Literal') return true

      const children = dataset.match(quad.object)
      return ![...children].filter((child: Quad) => (child.object as TouchableTerm).touched !== false).length
    })

  for (const quad of quadsToDelete) dataset.delete(quad)
}
