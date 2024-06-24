/// <reference types="vite/client" />

type GrapoiPointer = {
  in: (predicates?: Array<NamedNode>, objects?: Array<NamedNode>) => GrapoiPointer
  out: (predicates?: Array<NamedNode | null> | NamedNode, subjects?: Array<NamedNode> | NamedNode) => GrapoiPointer
  hasOut: (predicates?: Array<NamedNode | null> | NamedNode, subjects?: Array<NamedNode> | NamedNode) => GrapoiPointer
  deleteOut: (predicates?: Array<unknown> | unknown, objects?: Array<unknown> | unknown) => GrapoiPointer
  deleteIn: (predicates?: Array<unknown> | unknown, subjects?: Array<unknown> | unknown) => GrapoiPointer
  addOut: (predicates?: Array<unknown> | unknown, objects?: Array<unknown> | unknown) => GrapoiPointer
  quads: () => Array<Quad>
  trim(): GrapoiPointer
  distinct(): GrapoiPointer
  values: Array<string>
  filter: (callback: (item: GrapoiPointer) => boolean) => GrapoiPointer
  sort: (callback: (a: GrapoiPointer, b: GrapoiPointer) => number) => GrapoiPointer
  map: (callback: (item: GrapoiPointer) => any) => any
  value: string | number
  isList: () => boolean
  deleteList: () => GrapoiPointer
  best: (args: any[]) => GrapoiPointer
  list: () => Array<GrapoiPointer>
  ptrs: Array<{ dataset: DatasetCore } & GrapoiPointer>
  clone: (data?: unknown) => GrapoiPointer
  node: (pointers?: Array<unknown>) => GrapoiPointer
  execute: (paths: Array<unknown>) => GrapoiPointer
  executeAll: (paths: Array<unknown>) => GrapoiPointer
  replace: (replacement: unknown) => GrapoiPointer
  term: Term
  terms: Array<Term>
  [Symbol.iterator]: () => Iterator<GrapoiPointer>
}

declare module 'grapoi' {
  function grapoi({
    dataset,
    factory,
    term
  }: {
    dataset: Dataset
    factory?: DataFactory
    term?: NamedNode
  }): GrapoiPointer
  export = grapoi
}

declare module 'shacl-engine/lib/parsePath'

declare module 'd2l-fetch'
declare module 'd2l-fetch-dedupe'
declare module 'd2l-fetch-simple-cache'
declare module 'd2l-fetch-simple-cache/src/d2lfetch-simple-cache.js'
declare module 'nodeify-fetch'
declare module '@rdfjs/score'
