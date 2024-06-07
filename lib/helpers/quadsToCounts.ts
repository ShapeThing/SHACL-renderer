import { Quad, Term } from '@rdfjs/types'

export const quadsToCounts = (quads: Quad[], groupBy: 'subject' | 'predicate' | 'object') => {
  quads = [...quads]

  const counts: Map<Term, number> = new Map([...quads].map(quad => [quad[groupBy], 0]))

  for (const quad of quads) {
    counts.set(quad[groupBy], counts.get(quad[groupBy])! + 1)
  }

  return counts
}
