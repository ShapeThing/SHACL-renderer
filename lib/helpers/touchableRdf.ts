import type { Quad, Term } from '@rdfjs/types'

export type TouchableTerm = Term & {
  touched: boolean
  skipCallback?: boolean
}

export type TouchableQuad = Quad & {
  subject: {
    touched: boolean
    skipCallback?: boolean
  }
  predicate: {
    touched: boolean
    skipCallback?: boolean
  }
  object: {
    touched: boolean
    skipCallback?: boolean
  }
}
