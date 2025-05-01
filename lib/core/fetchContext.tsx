import { createContext, ReactNode } from 'react'
import { JSX } from 'react/jsx-runtime'
import { cachedFetch } from '../helpers/cachedFetch'

export const fetchContext = createContext<{ fetch: typeof fetch }>({ fetch: cachedFetch() })

export default function FetchContextProvider({
  children,
  fetch
}: {
  children: ReactNode
  fetch?: (typeof globalThis)['fetch']
}): JSX.Element {
  return <fetchContext.Provider value={{ fetch: fetch ?? cachedFetch() }}>{children}</fetchContext.Provider>
}
