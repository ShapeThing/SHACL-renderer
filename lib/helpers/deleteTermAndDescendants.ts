import type { Quad, Term } from '@rdfjs/types'
import Grapoi from '../Grapoi'

export const deleteTermAndDescendants = (item: Grapoi) => {
  const dataset = item.ptrs[0].dataset
  const [quad] = [...item.quads()]
  dataset.delete(quad)

  const findDescendants = (subject: Term): Quad[] => {
    if (!['BlankNode', 'NamedNode'].includes(subject.termType)) return []
    const descendants = dataset.match(subject)
    return [...descendants, ...[...descendants].flatMap((quad: Quad) => findDescendants(quad.object))]
  }

  if (quad.object.termType === 'BlankNode') {
    const allDescendants = findDescendants(quad.object)
    for (const descendent of allDescendants) dataset.delete(descendent)
  }
}
