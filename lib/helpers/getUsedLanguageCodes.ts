import { DatasetCore, Literal } from '@rdfjs/types'

export const getUsedLanguageCodes = (dataset: DatasetCore) => [
  ...new Set(
    [...dataset]
      .filter(quad => quad.object.termType === 'Literal' && (quad.object as Literal).language)
      .map(quad => (quad.object as Literal).language)
  )
]
