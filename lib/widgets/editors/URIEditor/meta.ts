import factory from '@rdfjs/data-model'
import { Grapoi } from 'grapoi'
import { dash, sh } from '../../../core/namespaces'
import { WidgetMeta } from '../../widgets-context'

export default {
  iri: dash('URIEditor'),
  createTerm: () => factory.namedNode(''),
  score: (data?: Grapoi, propertyShape?: Grapoi) => {
    const term = data?.terms[0]

    if (
      term &&
      term.value &&
      term.termType === 'NamedNode' &&
      propertyShape?.out(sh('nodeKind'))?.term?.equals(sh('IRI')) &&
      !propertyShape.out(sh('class'))?.term
    ) {
      return 10
    }

    if (term?.termType === 'NamedNode') {
      return 0
    }
  }
} satisfies WidgetMeta
