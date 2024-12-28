import { Grapoi } from 'grapoi'
import { sh } from '../../core/namespaces'
import { allLogicalPointers } from '../../helpers/allLogicalPointers'

export const splitPointers = (originalProperty: Grapoi, item: Grapoi) => {
  let property = originalProperty.clone({})
  const allPointers = allLogicalPointers(property)

  // sh:or support specifically for the current item.
  if (allPointers.length > 1) {
    const filteredPointers = allPointers.filter(pointer => {
      // TODO add other checks to invalidate certain property shapes.
      const nodeKind = pointer.out(sh('nodeKind')).term
      if (nodeKind?.equals(sh('IRI')) && item?.term?.termType !== 'NamedNode') return false
      if (nodeKind?.equals(sh('Literal')) && item?.term?.termType !== 'Literal') return false

      return true
    })

    if (filteredPointers.length === 1) {
      property = filteredPointers[0]
    } else {
      throw new Error('Not yet supported')
    }
  }

  return property
}
