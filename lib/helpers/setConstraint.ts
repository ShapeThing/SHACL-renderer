import dataFactory from '@rdfjs/data-model'
import { Term } from '@rdfjs/types'
import { Grapoi } from 'grapoi'
import { xsd } from '../core/namespaces'

export const setConstraint = (data: Grapoi) => (predicate: Term, value: string | number | Term) => {
  const valueTerm =
    typeof value === 'string'
      ? dataFactory.literal(value)
      : typeof value === 'number'
        ? dataFactory.literal(value.toString(), xsd('decimal'))
        : value
  data.deleteOut(predicate).addOut(predicate, valueTerm)
}
