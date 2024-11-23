import factory from '@rdfjs/data-model'
import { Grapoi } from 'grapoi'
import { dash, sh } from '../../../core/namespaces'
import { WidgetMeta } from '../../widgets-context'

export default {
  iri: dash('TextFieldEditor'),
  createTerm: (_language, property) => {
    /** @ts-ignore */
    const options = [...property?.out(sh('in')).list()]
    return options[0].term.termType === 'NamedNode' ? factory.namedNode('') : factory.literal('')
  },
  score: (_data?: Grapoi, propertyShape?: Grapoi) => {
    if (propertyShape && propertyShape.out(sh('in')).term) {
      return 40
    }
  }
} satisfies WidgetMeta
