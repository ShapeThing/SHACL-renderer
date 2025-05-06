import factory from '@rdfjs/data-model'
import Grapoi from '../../../Grapoi'
import { dash, sh, xsd } from '../../../core/namespaces'
import { WidgetMeta } from '../../widgets-context'

export default {
  iri: dash('BooleanSelectEditor'),
  createTerm: () => factory.literal('false', xsd('boolean')),
  score: (data?: Grapoi, propertyShape?: Grapoi) => {
    if (
      data &&
      data.term &&
      data.term.value &&
      data.term.termType === 'Literal' &&
      xsd('boolean').equals(data.term.datatype)
    ) {
      return 10
    }

    if (propertyShape && xsd('boolean').equals(propertyShape.out(sh('datatype')).term)) {
      return 5
    }
  }
} satisfies WidgetMeta
