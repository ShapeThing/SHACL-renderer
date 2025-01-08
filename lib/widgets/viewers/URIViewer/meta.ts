import { Grapoi } from 'grapoi'
import { dash, sh, xsd } from '../../../core/namespaces'
import { WidgetMeta } from '../../widgets-context'

export default {
  iri: dash('URIViewer'),
  score: (data?: Grapoi, propertyShape?: Grapoi) => {
    if (data && data.terms && data.terms[0]?.termType === 'NamedNode') {
      return 2
    }

    if (propertyShape && xsd('string').equals(propertyShape.out(sh('datatype')).term)) {
      return 1
    }
  }
} satisfies WidgetMeta
