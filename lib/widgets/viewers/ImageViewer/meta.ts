import Grapoi from '../../../Grapoi'
import { dash } from '../../../core/namespaces'
import { WidgetMeta } from '../../widgets-context'

export default {
  iri: dash('ImageViewer'),
  score: (data?: Grapoi) => {
    const term = data?.terms[0]

    if (term && ['.jpg', '.jpeg', '.gif', '.png'].some(extension => term.value.endsWith(extension))) {
      return 50
    }
  }
} satisfies WidgetMeta
