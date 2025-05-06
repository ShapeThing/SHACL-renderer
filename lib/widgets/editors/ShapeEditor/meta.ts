import factory from '@rdfjs/data-model'
import Grapoi from '../../../Grapoi'
import { sh, stsr } from '../../../core/namespaces'
import { WidgetMeta } from '../../widgets-context'

export default {
  iri: stsr('ShapeEditor'),
  createTerm: () => factory.literal(''),
  score: (_data?: Grapoi, propertyShape?: Grapoi) => {
    if (propertyShape && propertyShape.out(sh('path')).term.equals(sh('property'))) {
      return 100
    }
  },
  hidePlusButton: true
} satisfies WidgetMeta
