import { DatasetCore, NamedNode, Term } from '@rdfjs/types'
import { Grapoi } from 'grapoi'
import { ComponentType, LazyExoticComponent, ReactNode, createContext } from 'react'
import { coreWidgets } from './coreWidgets'

export type WidgetItem = {
  Component: LazyExoticComponent<ComponentType<Partial<WidgetProps>>>
  meta: WidgetMeta
}

export type WidgetMeta = {
  score?: (data: Grapoi, property: Grapoi) => number | undefined
  createTerm?: ({ activeContentLanguage }: { activeContentLanguage?: string }) => Term
  iri: NamedNode
  showIfEmpty?: true
}

type WidgetsContext = {
  editors: WidgetItem[]
  viewers: WidgetItem[]
  facets: WidgetItem[]
  lists: WidgetItem[]
  transformers: WidgetItem[]
}

export type WidgetProps = {
  data: Grapoi
  dataset: DatasetCore
  setConstraint: (predicate: NamedNode, value: string | number) => void
  property: Grapoi
  facetSearchData: Grapoi
  term: Term
  nodeDataPointer: Grapoi
  setTerm: (term: Term) => void
}

export const widgetsContext = createContext<WidgetsContext>(coreWidgets)

type WidgetsContextProviderProps = { children: ReactNode } & Partial<WidgetsContext>

export default function WidgetsContextProvider({
  children,
  editors = [],
  viewers = [],
  facets = [],
  lists = [],
  transformers = []
}: WidgetsContextProviderProps) {
  return (
    <widgetsContext.Provider
      value={{
        editors,
        viewers,
        facets,
        lists,
        transformers
      }}
    >
      {children}
    </widgetsContext.Provider>
  )
}
