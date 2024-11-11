import factory from '@rdfjs/data-model'
import { Term } from '@rdfjs/types'
import { Grapoi } from 'grapoi'
import { rdf } from '../core/namespaces'

export const replaceList = (terms: Array<Term>, pointer: Grapoi | undefined) => {
  pointer = pointer?.deleteList()

  for (const [index, term] of terms.entries()) {
    const next = index === terms.length - 1 ? rdf('nil') : factory.blankNode()
    pointer?.addOut([rdf('first')], [term])
    pointer?.addOut([rdf('rest')], [next])
    pointer = index === terms.length - 1 ? undefined : pointer?.node([next])
  }
}
