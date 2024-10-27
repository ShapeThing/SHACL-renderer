import factory from '@rdfjs/data-model'
import { Grapoi } from 'grapoi'
import { dash, rdf, sh } from '../../../core/namespaces'
import { TouchableTerm } from '../../../helpers/touchableRdf'
import { WidgetMeta } from '../../widgets-context'

export default {
  iri: dash('TextFieldWithLangEditor'),
  createTerm: () => factory.literal('', 'en'),
  score: (data?: Grapoi, propertyShape?: Grapoi) => {
    const term = data?.terms[0]

    if (
      term &&
      (term.value || (term as TouchableTerm).touched === false) &&
      term.termType === 'Literal' &&
      rdf('langString').equals(term.datatype)
    ) {
      return 10
    }

    if (propertyShape && rdf('langString').equals(propertyShape.out(sh('datatype')).term)) {
      return 5
    }
  }
} satisfies WidgetMeta
