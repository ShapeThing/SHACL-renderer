import { Localized } from '@fluent/react'
import { useContext } from 'react'
import { languageContext } from '../../core/language-context'
import { mainContext } from '../../core/main-context'

export default function InterfaceLanguagePicker() {
  const { setActiveInterfaceLanguage, activeInterfaceLanguage } = useContext(languageContext)
  const { interfaceLanguages } = useContext(mainContext)
  return Object.keys(interfaceLanguages).length > 1 ? (
    <div className="interface-language-picker">
      <label className="label">
        <Localized id="interface-language">Interface language</Localized>
      </label>

      <select
        value={activeInterfaceLanguage}
        onChange={event => {
          setActiveInterfaceLanguage(event.target.value)
        }}
      >
        {Object.entries(interfaceLanguages).map(([languageCode, label]) => (
          <option key={languageCode} value={languageCode}>
            {label[activeInterfaceLanguage] ?? languageCode}
          </option>
        ))}
      </select>
    </div>
  ) : null
}
