import { Quad_Subject } from '@rdfjs/types'
import Grapoi from '../../Grapoi'
import { nonNullable } from '../../helpers/nonNullable'
import { GrapoiWithId } from './SortableStore'

export const wrapGetItems = (getItemsGiven: (parent?: Quad_Subject) => Grapoi[]) => (parent?: Quad_Subject) => {
  const wrapped = (parent: Quad_Subject | undefined, depth: number): GrapoiWithId[] =>
    getItemsGiven(parent)
      .flatMap((pointer: Grapoi) => {
        return pointer
          .map((innerPointer: GrapoiWithId) => {
            innerPointer.id = innerPointer.value!
            innerPointer.depth = depth!
            return [innerPointer, ...wrapped(innerPointer.term, depth + 1)]
          })
          .flat()
      })
      .filter(nonNullable)

  return wrapped(parent, 0)
}
