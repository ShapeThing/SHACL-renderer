import datasetFactory from '@rdfjs/dataset'
import { Grapoi } from 'grapoi'
import { sh } from './namespaces'

export const getShapeSkeleton = (shape: Grapoi) => {
  const predicateWhiteList = [sh('path'), sh('property'), sh('targetClass')]

  const quads = shape.out().out().quads()
  const filteredQuads = [...quads].filter(quad => {
    return predicateWhiteList.some(predicate => predicate.equals(quad.predicate))
  })

  return datasetFactory.dataset(filteredQuads)
}
