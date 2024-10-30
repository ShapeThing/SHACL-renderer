import { ReactNode, useContext, useState } from 'react'
import IconRemove from '~icons/iconoir/xmark'
import { languageContext } from '../core/language-context'
import { mainContext } from '../core/main-context'
import AddLanguage from './AddLanguage'

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
      {Object.keys(localAllowedLanguages).length ? (
        <div className="languages">
          {Object.entries(localAllowedLanguages).map(([languageCode, label]) => (
            <button
              onClick={() => setActiveContentLanguage(languageCode)}
              className={`language-button ${activeContentLanguage === languageCode ? 'active' : ''}`}
            >
              {label}
              <span onClick={event => event.preventDefault()} className="remove-language">
                <IconRemove />
              </span>
            </button>
          ))}

          {isCreatingLanguage ? (
            <AddLanguage
              callback={(language?: { label: string; code: string }) => {
                setIsCreatingLanguage(false)
                if (language) {
                  setLanguages({ ...languages, [language.code]: language.label })
                }
              }}
            />
          ) : null}

          <button className="add-language button secondary" onClick={() => setIsCreatingLanguage(true)}>
            Add language
          </button>
        </div>
      ) : null}
      {children}
    </>
  )
}
