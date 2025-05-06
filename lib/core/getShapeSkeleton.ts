import datasetFactory from '@rdfjs/dataset'
import Grapoi from '../Grapoi'

export const getShapeSkeleton = (shape: Grapoi) => {
  const filteredQuads = shape.dataset ? [...shape.dataset] : []
  return datasetFactory.dataset(filteredQuads)
}
