import { useContext, useState } from 'react'
import { languageContext } from '../core/language-context'
import { mainContext } from '../core/main-context'
import AddLanguage from './AddLanguage'

type Props = {
  value: string
  onChange: (languageCode: string) => void
}

/**
 * Depending on the context this widget shows a language selector, if the system uses the tabbed display nothing is returned.
 */
export default function LanguageSelector({ value, onChange }: Props) {
  const { languageMode } = useContext(mainContext)
  const { languages, setLanguages, setActiveContentLanguage, activeInterfaceLanguage } = useContext(languageContext)

  const localAllowedLanguages = { ...languages }
  if (!(value in localAllowedLanguages)) localAllowedLanguages[value] = { [value]: value }
  const [isCreatingLanguage, setIsCreatingLanguage] = useState(false)

  return languageMode === 'individual' ? (
    <>
      <select
        value={value}
        onChange={event => {
          if (event.target.value === '_add_language') {
            setIsCreatingLanguage(true)
          } else {
            onChange(event.target.value)
          }
        }}
      >
        {Object.entries(localAllowedLanguages).map(([key, label]) => (
          <option key={key} value={key}>
            {label[activeInterfaceLanguage]}
          </option>
        ))}
        <option value={'_add_language'}>- Add a language -</option>
      </select>

      {isCreatingLanguage ? (
        <AddLanguage
          callback={(language?: { labels: Record<string, string>; code: string }) => {
            setIsCreatingLanguage(false)
            if (language) {
              onChange(language.code)
              setLanguages({ ...languages, [language.code]: language.labels })
              setActiveContentLanguage(language.code)
            }
          }}
        />
      ) : null}
    </>
  ) : null
}
