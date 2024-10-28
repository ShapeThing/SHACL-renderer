import { useContext } from 'react'
import { mainContext } from '../core/main-context'

type Props = {
  value: string
  onChange: (languageCode: string) => void
}

/**
 * Depending on the context this widget shows a language selector, if the system uses the tabbed display nothing is returned.
 */
export default function LanguageSelector({ value, onChange }: Props) {
  const { allowedLanguages, languageMode } = useContext(mainContext)
  const localAllowedLanguages = { ...allowedLanguages }
  if (!(value in localAllowedLanguages)) localAllowedLanguages[value] = value

  return languageMode === 'individual' ? (
    <select value={value} onChange={event => onChange(event.target.value)}>
      {Object.entries(localAllowedLanguages).map(([key, label]) => (
        <option key={key} value={key}>
          {label}
        </option>
      ))}
    </select>
  ) : null
}
