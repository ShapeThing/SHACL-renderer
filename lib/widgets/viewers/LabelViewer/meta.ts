import { Grapoi } from 'grapoi'
import { dash } from '../../../core/namespaces'
import { WidgetMeta } from '../../widgets-context'

export default {
  iri: dash('LabelViewer'),
  score: (data?: Grapoi) => {
    if (data && data.terms && data.terms[0]?.termType === 'NamedNode') {
      return 5
    }
  }
} satisfies WidgetMeta
