import { createContext, ReactNode, useContext, useState } from 'react'
import { getUsedLanguageCodes } from '../helpers/getUsedLanguageCodes'
import { mainContext } from './main-context'

export const languageContext = createContext<{
  activeContentLanguage?: string
  usedLanguageCodes: string[]
  setActiveContentLanguage: (languageCode: string) => void
}>({ setActiveContentLanguage: () => null, usedLanguageCodes: [] })

type Props = {
  children: ReactNode
}

export default function LanguageProvider({ children }: Props) {
  const { data } = useContext(mainContext)
  const usedLanguageCodes = getUsedLanguageCodes(data)

  const [activeContentLanguage, setActiveContentLanguage] = useState(usedLanguageCodes[0])
  return (
    <languageContext.Provider value={{ activeContentLanguage, setActiveContentLanguage, usedLanguageCodes }}>
      {children}
    </languageContext.Provider>
  )
}
