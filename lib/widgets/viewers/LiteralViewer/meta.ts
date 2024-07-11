import { Grapoi } from 'grapoi'
import { dash, sh, xsd } from '../../../core/namespaces'
import { WidgetMeta } from '../../widgets-context'

export default {
  iri: dash('LiteralViewer'),
  score: (data?: Grapoi, propertyShape?: Grapoi) => {
    if (data && data.term && data.term.termType === 'Literal') {
      return 1
    }

    if (propertyShape && xsd('string').equals(propertyShape.out(sh('datatype')).term)) {
      return 1
    }
  }
} satisfies WidgetMeta
