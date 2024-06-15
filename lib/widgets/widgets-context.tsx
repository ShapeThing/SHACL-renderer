import { NamedNode, Term } from '@rdfjs/types'
import { ComponentType, LazyExoticComponent, ReactNode, createContext } from 'react'
import { coreWidgets } from './coreWidgets'

export type WidgetItem = {
  Component: LazyExoticComponent<ComponentType<Partial<WidgetProps>>>
  meta: WidgetMeta
}

export type WidgetMeta = {
  score?: (data: GrapoiPointer, property: GrapoiPointer) => number
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
  data: GrapoiPointer
  setConstraint: (predicate: NamedNode, value: string | number) => void
  property: GrapoiPointer
  facetSearchData: GrapoiPointer
  term: Term
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
