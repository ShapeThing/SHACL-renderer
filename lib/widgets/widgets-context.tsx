import { NamedNode, Term } from '@rdfjs/types'
import { ReactComponentLike } from 'prop-types'
import { ReactNode, createContext } from 'react'
import { coreWidgets } from './coreWidgets'

export type WidgetItem = {
  Component: () => Promise<{ default: ReactComponentLike }>
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
  property: GrapoiPointer
  searchData: GrapoiPointer
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
