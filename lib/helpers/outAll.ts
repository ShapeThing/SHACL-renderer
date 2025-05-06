import type { Quad } from '@rdfjs/types'
import Grapoi from '../Grapoi'

export const outAll = (pointer: Grapoi) => {
  const quads: Quad[] = []

  pointer = pointer.out()

  let results = [...pointer.quads()]

  while (results.length) {
    results = [...pointer.quads()]
    quads.push(...results)
    pointer = pointer.out()
  }

  return quads
}
