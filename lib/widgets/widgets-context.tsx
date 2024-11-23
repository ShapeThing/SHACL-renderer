import type { DatasetCore, NamedNode, Term } from '@rdfjs/types'
import type { Grapoi } from 'grapoi'
import type { ComponentType, LazyExoticComponent, ReactNode } from 'react'
import { createContext } from 'react'
import { coreWidgets } from './coreWidgets'

export type WidgetItem = {
  Component: LazyExoticComponent<ComponentType<Partial<WidgetProps>>>
  meta: WidgetMeta
}

export type WidgetMeta = {
  score?: (data?: Grapoi, property?: Grapoi) => number | undefined
  createTerm?: ({ activeContentLanguage }: { activeContentLanguage?: string }, property?: Grapoi) => Term
  iri: NamedNode
  showIfEmpty?: true
}

type WidgetsContext = {
  editors: WidgetItem[]
  viewers: WidgetItem[]
  facets: WidgetItem[]
  lists: WidgetItem[]
  transformers: WidgetItem[]
  typings: WidgetItem[]
}

export type AdditionalWidgetConfiguration = {
  header?: () => ReactNode
  displayCriteria?: (term: Term, index: number) => boolean
  deletionCriteria?: (term: Term) => Promise<boolean>
}

export type WidgetProps = {
  data: Grapoi
  dataset: DatasetCore
  setConstraint: (predicate: NamedNode, value: string | number) => void
  property: Grapoi
  facetSearchData: Grapoi
  term: Term
  nodeDataPointer: Grapoi
  index: number
  setTerm: (term: Term) => void
  rerenderAfterManipulatingPointer: () => void
  useConfigureWidget: (configuration: AdditionalWidgetConfiguration) => void
}

export const widgetsContext = createContext<WidgetsContext>(coreWidgets)

type WidgetsContextProviderProps = { children: ReactNode } & Partial<WidgetsContext>

export default function WidgetsContextProvider({
  children,
  editors = [],
  viewers = [],
  facets = [],
  lists = [],
  transformers = [],
  typings = []
}: WidgetsContextProviderProps) {
  return (
    <widgetsContext.Provider
      value={{
        editors,
        viewers,
        facets,
        lists,
        transformers,
        typings
      }}
    >
      {children}
    </widgetsContext.Provider>
  )
}
