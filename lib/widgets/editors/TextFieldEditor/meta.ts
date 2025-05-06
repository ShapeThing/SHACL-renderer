import factory from '@rdfjs/data-model'
import Grapoi from '../../../Grapoi'
import { dash, sh, xsd } from '../../../core/namespaces'
import { TouchableTerm } from '../../../helpers/touchableRdf'
import { WidgetMeta } from '../../widgets-context'

export default {
  iri: dash('TextFieldEditor'),
  createTerm: () => factory.literal(''),
  score: (data?: Grapoi, propertyShape?: Grapoi) => {
    const term = data?.terms[0]

    if (
      term &&
      (term.value || (term as TouchableTerm).touched === false) &&
      term.termType === 'Literal' &&
      xsd('string').equals(term.datatype)
    ) {
      return 10
    }

    if (propertyShape && xsd('string').equals(propertyShape.out(sh('datatype')).term)) {
      return 5
    }
  }
} satisfies WidgetMeta
