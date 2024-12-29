import factory from '@rdfjs/data-model'
import { Literal } from '@rdfjs/types'

import LanguageSelector from '../../../components/LanguageSelector'
import { dash, sh } from '../../../core/namespaces'
import { WidgetProps } from '../../widgets-context'

export default function TextFieldEditor({ term, setTerm, property }: WidgetProps) {
  const { language } = term as Literal
  const multiLine = property.out(dash('singleLine')).term?.value === 'false'
  const maxLength = property.out(sh('maxLength')).value ? parseInt(property.out(sh('maxLength')).value) : undefined

  return (
    <div className="inner">
      {multiLine ? (
        <textarea
          className="input"
          rows={4}
          maxLength={maxLength}
          value={term.value}
          onChange={event => setTerm(factory.literal(event.target.value, language))}
        ></textarea>
      ) : (
        <input
          className="input"
          size={maxLength}
          maxLength={maxLength}
          value={term.value}
          onChange={event => setTerm(factory.literal(event.target.value, language))}
        />
      )}
      <LanguageSelector onChange={newLanguage => setTerm(factory.literal(term.value, newLanguage))} value={language} />
    </div>
  )
}
