import factory from '@rdfjs/data-model'
import { Grapoi } from 'grapoi'
import { dash, sh, xsd } from '../../../core/namespaces'
import { WidgetMeta } from '../../widgets-context'

export default {
  iri: dash('DatePickerEditor'),
  createTerm: () => factory.literal(''),
  score: (data?: Grapoi, propertyShape?: Grapoi) => {
    if (
      data &&
      data.term &&
      data.term.value &&
      data.term.termType === 'Literal' &&
      xsd('date').equals(data.term.datatype)
    ) {
      return 10
    }

    if (propertyShape && xsd('date').equals(propertyShape.out(sh('datatype')).term)) {
      return 5
    }
  }
} satisfies WidgetMeta
