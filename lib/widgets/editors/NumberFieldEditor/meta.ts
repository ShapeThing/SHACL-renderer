import factory from '@rdfjs/data-model'
import Grapoi from '../../../Grapoi'
import { sh, stsr, xsd } from '../../../core/namespaces'
import { WidgetMeta } from '../../widgets-context'

export default {
  iri: stsr('NumberFieldEditor'),
  createTerm: () => factory.literal('', xsd('decimal')),
  score: (data?: Grapoi, propertyShape?: Grapoi) => {
    if (
      data &&
      data.term &&
      data.term.value &&
      data.term.termType === 'Literal' &&
      (xsd('integer').equals(data.term.datatype) || xsd('decimal').equals(data.term.datatype))
    ) {
      return 10
    }

    if (
      propertyShape &&
      (xsd('integer').equals(propertyShape.out(sh('datatype')).term) ||
        xsd('decimal').equals(propertyShape.out(sh('datatype')).term))
    ) {
      return 5
    }
  }
} satisfies WidgetMeta
