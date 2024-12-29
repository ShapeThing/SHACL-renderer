import { LocalizationProvider, ReactLocalization } from '@fluent/react'
import { createContext, ReactNode, useContext, useMemo, useState } from 'react'
import { getUsedLanguageCodes } from '../helpers/getUsedLanguageCodes'
import { mainContext } from './main-context'

export const languageContext = createContext<{
  activeContentLanguage?: string
  usedLanguageCodes: string[]
  activeInterfaceLanguage: string
  languages: Record<string, Record<string, string>>
  setLanguages: React.Dispatch<React.SetStateAction<Record<string, Record<string, string>>>>
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

export default function LanguageProvider({ children }: Props) {
  const {
    contentLanguages: languagesSetting,
    shapePointer,
    dataPointer,
    activeContentLanguage: givenActiveContentLanguage,
    activeInterfaceLanguage: givenActiveInterfaceLanguage,
    localizationBundles
  } = useContext(mainContext)
  const usedLanguageCodes = dataPointer ? getUsedLanguageCodes(shapePointer, dataPointer) : []
  const [languages, setLanguages] = useState<Record<string, Record<string, string>>>(languagesSetting)
  const [activeContentLanguage, setActiveContentLanguage] = useState(
    givenActiveContentLanguage ?? usedLanguageCodes[0] ?? Object.keys(languagesSetting)[0]
  )
  const [activeInterfaceLanguage, setActiveInterfaceLanguage] = useState(givenActiveInterfaceLanguage ?? 'en')
  const l10n = useMemo(
    () => new ReactLocalization([localizationBundles[activeInterfaceLanguage]]),
    [activeInterfaceLanguage]
  )

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
      <LocalizationProvider l10n={l10n}>{children}</LocalizationProvider>
    </languageContext.Provider>
  )
}
