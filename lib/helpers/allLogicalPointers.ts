import Grapoi from '../Grapoi'
import { sh } from '../core/namespaces'

export const allLogicalPointers = (property: Grapoi) => {
  const orPointers = property.out(sh('or')).distinct()?.list()

  return orPointers
    ? /** @ts-expect-error type is missing */
      [...orPointers].map(orPointer => {
        return property.node(
          [...property.ptrs, ...orPointer.ptrs].flatMap(p => [...(p.edges ?? []), ...(p.terms ?? [])])
        )
      })
    : [property]
}
