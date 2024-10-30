import { useState } from 'react'

type Props = {
  callback: (language?: { label: string; code: string }) => void
}

export default function AddLanguage({ callback }: Props) {
  const [languageCode, setLanguageCode] = useState('')
  const [languageLabel, setLanguageLabel] = useState('')

  return (
    <dialog className="add-language-dialog" open>
      <form method="dialog" onSubmit={() => callback({ label: languageLabel, code: languageCode })}>
        <label>Language</label>

        <div className="editor">
          <input
            required
            type="text"
            className="input"
            value={languageLabel}
            onChange={event => setLanguageLabel(event.target.value)}
          />
        </div>

        <label>Code</label>

        <div className="editor">
          <input
            type="text"
            required
            className="input"
            value={languageCode}
            onChange={event => setLanguageCode(event.target.value)}
          />
        </div>

        <div className="actions">
          <a
            href="#"
            onClick={event => {
              event.preventDefault()
              callback()
            }}
          >
            Cancel
          </a>
          <button className="primary button">Create</button>
        </div>
      </form>
    </dialog>
  )
}
