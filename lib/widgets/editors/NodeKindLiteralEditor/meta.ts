import { Grapoi } from 'grapoi'
import { sh, stsr } from '../../../core/namespaces'
import { WidgetMeta } from '../../widgets-context'

export default {
  iri: stsr('NodeKindLiteralEditor'),
  showIfEmpty: true,
  score: (_data?: Grapoi, propertyShape?: Grapoi) => {
    if (
      propertyShape &&
      !propertyShape.out(sh('datatype'))?.term &&
      propertyShape.out(sh('nodeKind'))?.term?.equals(sh('Literal'))
    ) {
      return 5
    }
  }
} satisfies WidgetMeta
