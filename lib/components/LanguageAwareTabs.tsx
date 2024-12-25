import { Localized } from '@fluent/react'
import { Icon } from '@iconify-icon/react'
import { ReactNode, useContext, useState } from 'react'
import { languageContext } from '../core/language-context'
import { mainContext } from '../core/main-context'
import AddLanguage from './AddLanguage'
import InterfaceLanguagePicker from './InterfaceLanguagePicker'

type Props = {
  children: ReactNode
}

export default function LanguageAwareTabs({ children }: Props) {
  const { languageMode, mode } = useContext(mainContext)
  const [isCreatingLanguage, setIsCreatingLanguage] = useState(false)

  const { usedLanguageCodes, activeContentLanguage, setActiveContentLanguage, languages, setLanguages } =
    useContext(languageContext)
  const localAllowedLanguages = { ...languages }

  for (const usedLanguageCode of usedLanguageCodes) {
    if (!(usedLanguageCode in localAllowedLanguages)) localAllowedLanguages[usedLanguageCode] = usedLanguageCode
  }

  return languageMode === 'individual' || mode === 'facet' ? (
    children
  ) : (
    <>
      <div className="languages">
        {Object.keys(localAllowedLanguages).length ? (
          <>
            {Object.entries(localAllowedLanguages).map(([languageCode, label]) => (
              <button
                key={languageCode}
                onClick={() => setActiveContentLanguage(languageCode)}
                className={`language-button ${activeContentLanguage === languageCode ? 'active' : ''}`}
              >
                {label}
                <span
                  onClick={event => {
                    event.preventDefault()
                    throw new Error('Not yet implemented')
                  }}
                  className="remove-language"
                >
                  <Icon icon="iconoir:xmark" />
                </span>
              </button>
            ))}
            {isCreatingLanguage ? (
              <AddLanguage
                callback={(language?: { label: string; code: string }) => {
                  setIsCreatingLanguage(false)
                  if (language) {
                    setLanguages({ ...languages, [language.code]: language.label })
                    setActiveContentLanguage(language.code)
                  }
                }}
              />
            ) : null}
            <button className="add-language button secondary small" onClick={() => setIsCreatingLanguage(true)}>
              <Localized id="add-language">Add language</Localized>
            </button>
          </>
        ) : null}

        <InterfaceLanguagePicker />
      </div>
      {children}
    </>
  )
}
