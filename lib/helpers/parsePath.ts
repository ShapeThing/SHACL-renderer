/**
 * This file is taken from shacl-engine, I could not directly import it as it is not exported
 * and jsr was making it difficult to import it. (I tried to publish at jsr. But that is still not possible)
 */
import namespace from '@rdfjs/namespace'
import { Grapoi } from 'grapoi'

const owl = namespace('http://www.w3.org/2002/07/owl#')
const rdf = namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#')
const rdfs = namespace('http://www.w3.org/2000/01/rdf-schema#')
const sh = namespace('http://www.w3.org/ns/shacl#')
const shn = namespace('https://schemas.link/shacl-next#')
const xsd = namespace('http://www.w3.org/2001/XMLSchema#')

const ns = { owl, rdf, rdfs, sh, shn, xsd }

function parseStep(ptr: Grapoi) {
  if (ptr.term.termType !== 'BlankNode') {
    return {
      quantifier: 'one',
      start: 'subject',
      end: 'object',
      predicates: [ptr.term]
    }
  }

  const alternativePtr = ptr.out([ns.sh.alternativePath])

  if (alternativePtr.ptrs.length === 1 && alternativePtr.ptrs[0].isList()) {
    return {
      quantifier: 'one',
      start: 'subject',
      end: 'object',
      /** @ts-expect-error The typing does not match */
      predicates: [...alternativePtr.list()].map(ptr => ptr.term)
    }
  }

  const inversePtr = ptr.out([ns.sh.inversePath])

  if (inversePtr.term) {
    return {
      quantifier: 'one',
      start: 'object',
      end: 'subject',
      predicates: [inversePtr.term]
    }
  }

  const oneOrMorePtr = ptr.out([ns.sh.oneOrMorePath])

  if (oneOrMorePtr.term) {
    return {
      quantifier: 'oneOrMore',
      start: 'subject',
      end: 'object',
      predicates: [oneOrMorePtr.term]
    }
  }

  const zeroOrMorePtr = ptr.out([ns.sh.zeroOrMorePath])

  if (zeroOrMorePtr.term) {
    return {
      quantifier: 'zeroOrMore',
      start: 'subject',
      end: 'object',
      predicates: [zeroOrMorePtr.term]
    }
  }

  const zeroOrOnePtr = ptr.out([ns.sh.zeroOrOnePath])

  if (zeroOrOnePtr.term) {
    return {
      quantifier: 'zeroOrOne',
      start: 'subject',
      end: 'object',
      predicates: [zeroOrOnePtr.term]
    }
  }
}

function parsePath(ptr: Grapoi) {
  if (ptr.terms.length === 0) {
    return null
  }

  if (!ptr.ptrs[0].isList()) {
    return [parseStep(ptr)]
  }

  return [...ptr.list()].map(stepPtr => parseStep(stepPtr))
}

export default parsePath
