import { Literal } from '@rdfjs/types'
import { Grapoi } from 'grapoi'
import parsePath from 'shacl-engine/lib/parsePath'
import { sh } from '../core/namespaces'

export const getUsedLanguageCodes = (shapePointer: Grapoi, dataPointer: Grapoi) => {
  const properties = shapePointer.out(sh('property'))

  const quads = []
  for (const property of properties) {
    const path = parsePath(property.out(sh('path')))
    quads.push(...dataPointer.executeAll(path).quads())
    // TODO should we add support for nested graphs?
  }

  return [
    ...new Set(
      quads
        .filter(quad => quad.object.termType === 'Literal' && (quad.object as Literal).language)
        .map(quad => (quad.object as Literal).language)
    )
  ]
}
