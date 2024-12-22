import { createContext, ReactNode, useContext, useState } from 'react'
import { getUsedLanguageCodes } from '../helpers/getUsedLanguageCodes'
import { mainContext } from './main-context'

export const languageContext = createContext<{
  activeContentLanguage?: string
  usedLanguageCodes: string[]
  activeInterfaceLanguage: string
  languages: Record<string, string>
  setLanguages: React.Dispatch<React.SetStateAction<Record<string, string>>>
  setActiveContentLanguage: (languageCode: string) => void
  setActiveInterfaceLanguage: (languageCode: string) => void
}>({
  setActiveContentLanguage: () => null,
  setActiveInterfaceLanguage: () => null,
  setLanguages: () => null,
  activeInterfaceLanguage: 'en',
  usedLanguageCodes: [],
  languages: {}
})

type Props = {
  children: ReactNode
  activeContentLanguage?: string
  activeInterfaceLanguage?: string
}

export default function LanguageProvider({
  children,
  activeContentLanguage: givenActiveContentLanguage,
  activeInterfaceLanguage: givenActiveInterfaceLanguage
}: Props) {
  const { contentLanguages: languagesSetting, shapePointer, dataPointer } = useContext(mainContext)
  const usedLanguageCodes = dataPointer ? getUsedLanguageCodes(shapePointer, dataPointer) : []
  const [languages, setLanguages] = useState<Record<string, string>>(languagesSetting)
  const [activeContentLanguage, setActiveContentLanguage] = useState(
    givenActiveContentLanguage ?? usedLanguageCodes[0] ?? Object.keys(languagesSetting)[0]
  )
  const [activeInterfaceLanguage, setActiveInterfaceLanguage] = useState(givenActiveInterfaceLanguage ?? 'en')

  return (
    <languageContext.Provider
      value={{
        activeContentLanguage,
        setActiveContentLanguage,
        usedLanguageCodes,
        languages,
        setLanguages,
        activeInterfaceLanguage,
        setActiveInterfaceLanguage
      }}
    >
      {children}
    </languageContext.Provider>
  )
}
