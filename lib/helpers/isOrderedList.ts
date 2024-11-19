import { NamedNode } from '@rdfjs/types'
import { rdf } from '../core/namespaces'

export const isOrderedList = (path: { quantifier: string; predicates: NamedNode[] }[]) => {
  return (
    path &&
    path.length === 3 &&
    path?.[0].quantifier === 'one' &&
    path?.[1].quantifier === 'zeroOrMore' &&
    path?.[2].quantifier === 'one' &&
    path[1].predicates[0].equals(rdf('rest')) &&
    path[2].predicates[0].equals(rdf('first'))
  )
}
