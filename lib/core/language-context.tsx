import { createContext, ReactNode, useContext, useState } from 'react'
import { getUsedLanguageCodes } from '../helpers/getUsedLanguageCodes'
import { mainContext } from './main-context'

export const languageContext = createContext<{
  activeContentLanguage?: string
  usedLanguageCodes: string[]
  languages: Record<string, string>
  setLanguages: React.Dispatch<React.SetStateAction<Record<string, string>>>
  setActiveContentLanguage: (languageCode: string) => void
}>({
  setActiveContentLanguage: () => null,
  setLanguages: () => null,
  usedLanguageCodes: [],
  languages: {}
})

type Props = {
  children: ReactNode
}

export default function LanguageProvider({ children }: Props) {
  const { languages: languagesSetting, shapePointer, dataPointer } = useContext(mainContext)
  const usedLanguageCodes = dataPointer ? getUsedLanguageCodes(shapePointer, dataPointer) : []
  const [languages, setLanguages] = useState<Record<string, string>>(languagesSetting)
  const [activeContentLanguage, setActiveContentLanguage] = useState(usedLanguageCodes[0])

  return (
    <languageContext.Provider
      value={{ activeContentLanguage, setActiveContentLanguage, usedLanguageCodes, languages, setLanguages }}
    >
      {children}
    </languageContext.Provider>
  )
}
