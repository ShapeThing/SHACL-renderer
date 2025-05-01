import type { NamedNode, Quad_Subject } from '@rdfjs/types'
import { ReactNode, useReducer } from 'react'
import { mainContext, MainContext } from '../core/main-context'
import { renameSubject as renameSubjectFull } from '../helpers/renameSubject'

type MainContextProviderProps = {
  children?: ReactNode
  context: MainContext
}

export function MainContextProvider({ children, context }: MainContextProviderProps) {
  const [updates, update] = useReducer(x => x + 1, 0)

  const renameSubject = (newSubject: Quad_Subject) => {
    if (!newSubject.equals(context.subject)) {
      renameSubjectFull(context.data, context.subject, newSubject)
      context.dataPointer = context.dataPointer.node(newSubject)
      context.subject = newSubject as NamedNode
    }
    update()
  }
  return context ? (
    <mainContext.Provider value={{ ...context, renameSubject, updates, update }}>{children}</mainContext.Provider>
  ) : null
}
