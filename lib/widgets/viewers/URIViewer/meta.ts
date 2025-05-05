import { dash } from '../../../core/namespaces'
import Grapoi from '../../../Grapoi'
import { WidgetMeta } from '../../widgets-context'

export default {
  iri: dash('URIViewer'),
  score: (data?: Grapoi, propertyShape?: Grapoi) => {
    if (data && data.terms && data.terms[0]?.termType === 'NamedNode') {
      return 2
    }
  }
} satisfies WidgetMeta
