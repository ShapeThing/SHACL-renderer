import { Grapoi } from 'grapoi'
import { dash, sh } from '../../../core/namespaces'
import { WidgetMeta } from '../../widgets-context'

export default {
  iri: dash('LiteralViewer'),
  score: (data?: Grapoi, propertyShape?: Grapoi) => {
    if (propertyShape && !propertyShape.out(sh('node')).term) {
      return 1
    }
  }
} satisfies WidgetMeta
