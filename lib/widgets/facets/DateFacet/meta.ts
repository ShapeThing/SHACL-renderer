import { Grapoi } from 'grapoi'
import { sh, stf, xsd } from '../../../core/namespaces'
import { WidgetMeta } from '../../widgets-context'

export default {
  iri: stf('DateFacet'),
  score: (data?: Grapoi, property?: Grapoi) => {
    if (
      data &&
      data.terms?.[0].termType === 'Literal' &&
      data.terms?.[0]?.datatype &&
      xsd('date').equals(data.terms[0].datatype)
    ) {
      return 10
    }

    if (property && xsd('date').equals(property.out(sh('datatype')).term)) {
      return 5
    }
  }
} satisfies WidgetMeta
