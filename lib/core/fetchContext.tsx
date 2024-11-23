import { createContext, ReactNode } from 'react'
import { cachedFetch } from '../helpers/cachedFetch'

export const fetchContext = createContext<{ fetch: typeof fetch }>({ fetch })

export default function FetchContextProvider({ children }: { children: ReactNode }) {
  return <fetchContext.Provider value={{ fetch: cachedFetch }}>{children}</fetchContext.Provider>
}
