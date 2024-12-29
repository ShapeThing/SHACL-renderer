import { Localized } from '@fluent/react'
import { Dispatch, SetStateAction, useContext, useState } from 'react'
import { languageContext } from '../core/language-context'
import { mainContext } from '../core/main-context'

type Props = {
  callback: (language?: { labels: Record<string, string>; code: string }) => void
}

function LanguageLabelField({
  labelLanguage,
  languageCode,
  setLanguageLabels
}: {
  languageCode: string
  labelLanguage?: string
  setLanguageLabels: Dispatch<SetStateAction<Record<string, string>>>
}) {
  const [languageLabel, setLanguageLabel] = useState('')

  return (
    <div className="property" key={languageCode}>
      <label className="label">
        {labelLanguage ? (
          <Localized id="label-in-language" vars={{ language: labelLanguage }}>
            <>Label in {labelLanguage}</>
          </Localized>
        ) : (
          <Localized id="label-in-the-language">Label in the language itself</Localized>
        )}
      </label>
      <div className="editor">
        <input
          required
          type="text"
          className="input"
          value={languageLabel}
          onChange={event => {
            setLanguageLabel(event.target.value)
            setLanguageLabels(labels => ({ ...labels, [languageCode]: event.target.value }))
          }}
        />
      </div>
    </div>
  )
}

export default function AddLanguage({ callback }: Props) {
  const [languageCode, setLanguageCode] = useState('')
  const [languageLabels, setLanguageLabels] = useState<Record<string, string>>({})
  const { interfaceLanguages } = useContext(mainContext)

  const { activeInterfaceLanguage } = useContext(languageContext)

  return (
    <dialog className="add-language-dialog" open>
      <form
        method="dialog"
        onSubmit={() => {
          callback({ labels: languageLabels, code: languageCode })
        }}
      >
        {Object.entries(interfaceLanguages).map(([languageCode, language]) => (
          <LanguageLabelField
            labelLanguage={language[activeInterfaceLanguage] ?? languageCode}
            languageCode={languageCode}
            key={languageCode}
            setLanguageLabels={setLanguageLabels}
          />
        ))}

        <div className="property">
          <label className="label">
            <Localized id="language-code">Language code</Localized>
          </label>
          <div className="editor">
            <input
              type="text"
              required
              className="input"
              value={languageCode}
              onChange={event => setLanguageCode(event.target.value)}
            />
          </div>
        </div>

        <div className="add-language-actions">
          <button
            className="button secondary outline"
            onClick={event => {
              event.preventDefault()
              callback()
            }}
          >
            <Localized id="cancel">Cancel</Localized>
          </button>
          <button className="primary button">
            <Localized id="save">Save</Localized>
          </button>
        </div>
      </form>
    </dialog>
  )
}
