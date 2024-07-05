import { Grapoi } from 'grapoi'
import { sh, stsr } from '../../../core/namespaces'

export const iri = stsr('NodeKindLiteralEditor')

export const score = (_data?: Grapoi, propertyShape?: Grapoi) => {
  if (
    propertyShape &&
    !propertyShape.out(sh('datatype'))?.term &&
    propertyShape.out(sh('nodeKind'))?.term?.equals(sh('Literal'))
  ) {
    return 5
  }
}

export const showIfEmpty = true
