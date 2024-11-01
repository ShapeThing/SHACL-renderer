import type { Quad } from '@rdfjs/types'
import type { Grapoi } from 'grapoi'

export const outAll = (pointer: Grapoi) => {
  const quads: Quad[] = []

  let results = [...pointer.quads()]

  while (results.length) {
    results = [...pointer.quads()]
    quads.push(...results)
    pointer = pointer.out()
  }

  return quads
}
