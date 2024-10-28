import { useContext } from 'react'
import { mainContext } from '../core/main-context'

type Props = {
  value: string
  onChange: (languageCode: string) => void
}

export default function LanguageSelector({ value, onChange }: Props) {
  const { allowedLanguages } = useContext(mainContext)
  const localAllowedLanguages = { ...allowedLanguages }
  if (!(value in localAllowedLanguages)) localAllowedLanguages[value] = value

  return (
    <select value={value} onChange={event => onChange(event.target.value)}>
      {Object.entries(localAllowedLanguages).map(([key, label]) => (
        <option key={key} value={key}>
          {label}
        </option>
      ))}
    </select>
  )
}
