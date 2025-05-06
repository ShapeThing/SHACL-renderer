import Grapoi from '../../../Grapoi'
import { dash, sh } from '../../../core/namespaces'
import { WidgetMeta } from '../../widgets-context'

export default {
  iri: dash('DetailsViewer'),
  score: (data?: Grapoi, property?: Grapoi) => {
    // if (property && !property.out(sh('node')).value) return -1

    if (data && data.terms && data.terms[0]?.termType === 'BlankNode') {
      return 1
    }

    if (property && sh('BlankNode').equals(property.out(sh('nodeKind')).term)) {
      return 1
    }
  }
} satisfies WidgetMeta
