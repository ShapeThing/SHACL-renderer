import { ReactNode, useContext } from 'react'
import { languageContext } from '../core/language-context'
import { mainContext } from '../core/main-context'

type Props = {
  children: ReactNode
}

export default function LanguageAwareTabs({ children }: Props) {
  const { languageMode, allowedLanguages, mode } = useContext(mainContext)
  const { usedLanguageCodes, activeContentLanguage, setActiveContentLanguage } = useContext(languageContext)
  const localAllowedLanguages = { ...allowedLanguages }

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
              onClick={() => {
                setActiveContentLanguage(languageCode)
              }}
              className={`language-button ${activeContentLanguage === languageCode ? 'active' : ''}`}
            >
              {label}
            </button>
          ))}
        </div>
      ) : null}
      {children}
    </>
  )
}
