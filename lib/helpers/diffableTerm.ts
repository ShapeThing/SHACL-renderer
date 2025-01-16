import type { Quad, Term } from '@rdfjs/types'

export type DiffableTerm = Term & {
  diffState?: 'deleted' | 'added'
}

export type DiffableQuad = Quad & {
  subject: {
    diffState?: 'deleted' | 'added'
  }
  predicate: {
    diffState?: 'deleted' | 'added'
  }
  object: {
    diffState?: 'deleted' | 'added'
  }
}
