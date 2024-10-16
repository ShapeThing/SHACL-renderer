import { Term } from '@rdfjs/types'
import { Grapoi } from 'grapoi'

export const sortPointersStable = (newItems: Grapoi, oldTerms: Term[]) => {
  const newTerms = newItems.terms

  const newTerm = newTerms.find(term => !oldTerms.some(innerTerm => innerTerm.equals(term)))
  const oldTerm = oldTerms.find(term => !newTerms.some(innerTerm => innerTerm.equals(term)))

  // This keeps the dataset core stable.
  ;(newItems.ptrs as Grapoi[]).sort((a: Grapoi, b: Grapoi) => {
    if (a.term.value === '') return 1000
    if (b.term.value === '') return -1000

    const aTerm = a.term.equals(newTerm) ? oldTerm : oldTerms.find(term => term.equals(a.term))
    const bTerm = b.term.equals(newTerm) ? oldTerm : oldTerms.find(term => term.equals(b.term))

    const aIndex = aTerm ? oldTerms.indexOf(aTerm) : 0
    const bIndex = bTerm ? oldTerms.indexOf(bTerm) : 0

    return aIndex - bIndex
  })
}
