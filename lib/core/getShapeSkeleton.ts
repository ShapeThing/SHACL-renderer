import datasetFactory from '@rdfjs/dataset'
import { sh } from './namespaces'

export const getShapeSkeleton = (shape: GrapoiPointer) => {
  const predicateWhiteList = [sh('path'), sh('property'), sh('targetClass')]

  const quads = shape.out().out().quads()
  const filteredQuads = [...quads].filter(quad => {
    return predicateWhiteList.some(predicate => predicate.equals(quad.predicate))
  })

  return datasetFactory.dataset(filteredQuads)
}
