import factory from '@rdfjs/data-model'
import { Grapoi } from 'grapoi'
import { dash, sh } from '../../../core/namespaces'
import { WidgetMeta } from '../../widgets-context'

export default {
  iri: dash('TextFieldEditor'),
  createTerm: () => factory.literal(''),
  score: (_data?: Grapoi, propertyShape?: Grapoi) => {
    if (propertyShape && propertyShape.out(sh('in')).term) {
      return 10
    }
  }
} satisfies WidgetMeta
