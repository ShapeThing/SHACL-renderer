import { NamedNode, Term } from '@rdfjs/types'
import { ReactComponentLike } from 'prop-types'
import { ReactNode, createContext } from 'react'
import { coreWidgets } from './coreWidgets'

export type WidgetItem = {
  Component: Promise<ReactComponentLike> | ReactComponentLike
  meta: WidgetMeta
}

export type WidgetMeta = {
  score: (data: GrapoiPointer, property: GrapoiPointer) => number
  createTerm: () => Term
  iri: NamedNode
}

type WidgetsContext = {
  editors: WidgetItem[]
  viewers: WidgetItem[]
  facets: WidgetItem[]
}

export type WidgetProps = {
  term: Term
  setTerm: (term: Term) => void
}

export const widgetsContext = createContext<WidgetsContext>(coreWidgets)

type WidgetsContextProviderProps = { children: ReactNode } & Partial<WidgetsContext>

export default function WidgetsContextProvider({
  children,
  editors = [],
  viewers = [],
  facets = []
}: WidgetsContextProviderProps) {
  return (
    <widgetsContext.Provider
      value={{
        editors,
        viewers,
        facets
      }}
    >
      {children}
    </widgetsContext.Provider>
  )
}
