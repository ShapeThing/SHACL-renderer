import factory from '@rdfjs/data-model'
import { Grapoi } from 'grapoi'
import { dash, sh } from '../../../core/namespaces'
import { WidgetMeta } from '../../widgets-context'

export default {
  iri: dash('EnumEditor'),
  createTerm: (_language, property) => {
    const mode = property?.out(sh('in')).isList()
    if (mode === true) {
      /** @ts-ignore */
      const options = [...property?.out(sh('in')).list()]
      return options[0].term.termType === 'NamedNode' ? factory.namedNode('') : factory.literal('')
    } else if (mode === false) {
      return factory.namedNode('')
    } else {
      return factory.namedNode('')
    }
  },
  score: (_data?: Grapoi, propertyShape?: Grapoi) => {
    if (propertyShape && propertyShape.out(sh('in')).term) {
      return 40
    }
  }
} satisfies WidgetMeta
