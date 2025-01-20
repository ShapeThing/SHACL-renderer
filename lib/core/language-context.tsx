import { FluentBundle, FluentResource } from '@fluent/bundle'
import { LocalizationProvider, ReactLocalization } from '@fluent/react'
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { cachedFetch } from '../helpers/cachedFetch'
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

/** @ts-ignore */
const localizationFetch = (globalThis.localizationFetch =
  /** @ts-ignore */
  globalThis.localizationFetch ?? cachedFetch()) as (typeof globalThis)['fetch']

export const createLocalizationBundles = async (languageCodes: string[]) => {
  const translations = languageCodes.map(languageCode =>
    localizationFetch(`/translations/${languageCode}/shacl-renderer.ftl`)
      .then(response => response.text())
      .then(translation => new FluentResource(translation))
      .then(resource => {
        const bundle = new FluentBundle(languageCode)
        bundle.addResource(resource)
        return [languageCode, bundle] as [string, FluentBundle]
      })
  )

  return Object.fromEntries(await Promise.all(translations))
}

export default function LanguageProvider({ children }: Props) {
  const {
    contentLanguages: languagesSetting,
    shapePointer,
    dataPointer,
    interfaceLanguages,
    activeContentLanguage: givenActiveContentLanguage,
    activeInterfaceLanguage: givenActiveInterfaceLanguage
  } = useContext(mainContext)

  const [localizationBundles, setLocalizationBundles] = useState<Record<string, FluentBundle>>()
  useEffect(() => {
    createLocalizationBundles(Object.keys(interfaceLanguages)).then(setLocalizationBundles)
  }, [])

  const usedLanguageCodes = dataPointer ? getUsedLanguageCodes(shapePointer, dataPointer) : []
  const [languages, setLanguages] = useState<Record<string, Record<string, string>>>(languagesSetting)
  const [activeContentLanguage, setActiveContentLanguage] = useState(
    givenActiveContentLanguage ?? usedLanguageCodes[0] ?? Object.keys(languagesSetting)[0]
  )
  const [activeInterfaceLanguage, setActiveInterfaceLanguage] = useState(givenActiveInterfaceLanguage ?? 'en')
  const l10n = useMemo(
    () => (localizationBundles ? new ReactLocalization([localizationBundles?.[activeInterfaceLanguage]]) : null),
    [activeInterfaceLanguage, localizationBundles]
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
      {l10n ? <LocalizationProvider l10n={l10n}>{children}</LocalizationProvider> : null}
    </languageContext.Provider>
  )
}
