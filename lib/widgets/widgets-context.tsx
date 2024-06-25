import { NamedNode, Term } from '@rdfjs/types'
import { Grapoi } from 'grapoi'
import { ComponentType, LazyExoticComponent, ReactNode, createContext } from 'react'
import { coreWidgets } from './coreWidgets'

export type WidgetItem = {
  Component: LazyExoticComponent<ComponentType<Partial<WidgetProps>>>
  meta: WidgetMeta
}

export type WidgetMeta = {
  score?: (data: Grapoi, property: Grapoi) => number
  createTerm?: () => Term
  iri: NamedNode
}

type WidgetsContext = {
  editors: WidgetItem[]
  viewers: WidgetItem[]
  facets: WidgetItem[]
  lists: WidgetItem[]
}

export type WidgetProps = {
  data: Grapoi
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
  lists = []
}: WidgetsContextProviderProps) {
  return (
    <widgetsContext.Provider
      value={{
        editors,
        viewers,
        facets,
        lists
      }}
    >
      {children}
    </widgetsContext.Provider>
  )
}
