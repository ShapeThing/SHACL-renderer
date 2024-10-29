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
  const { languages, setLanguages } = useContext(languageContext)

  const localAllowedLanguages = { ...languages }
  if (!(value in localAllowedLanguages)) localAllowedLanguages[value] = value
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
            {label}
          </option>
        ))}
        <option value={'_add_language'}>- Add a language -</option>
      </select>

      {isCreatingLanguage ? (
        <AddLanguage
          callback={(language?: { label: string; code: string }) => {
            setIsCreatingLanguage(false)
            if (language) {
              setLanguages({ ...languages, [language.code]: language.label })
              onChange(language.code)
            }
          }}
        />
      ) : null}
    </>
  ) : null
}
