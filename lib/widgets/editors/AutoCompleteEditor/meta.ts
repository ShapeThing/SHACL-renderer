import factory from '@rdfjs/data-model'
import { Grapoi } from 'grapoi'
import { dash, sh } from '../../../core/namespaces'
import { TouchableTerm } from '../../../helpers/touchableRdf'
import { WidgetMeta } from '../../widgets-context'

export default {
  iri: dash('AutoCompleteEditor'),
  createTerm: () => factory.literal(''),
  score: (data?: Grapoi, propertyShape?: Grapoi) => {
    const term = data?.terms[0]

    if (term && (term.value || (term as TouchableTerm).touched === false) && term.termType === 'NamedNode') {
      return 2
    }

    if (
      propertyShape &&
      (sh('BlankNodeOrIRI').equals(propertyShape.out(sh('nodeKind')).term) ||
        sh('IRI').equals(propertyShape.out(sh('nodeKind')).term) ||
        sh('BlankNode').equals(propertyShape.out(sh('nodeKind')).term))
    ) {
      return 2
    }

    if (propertyShape && propertyShape.out(sh('node')).term) {
      return 1
    }
  }
} satisfies WidgetMeta
