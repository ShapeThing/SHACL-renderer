import factory from '@rdfjs/data-model'
import { Literal } from '@rdfjs/types'

import LanguageSelector from '../../../components/LanguageSelector'
import { dash } from '../../../core/namespaces'
import { WidgetProps } from '../../widgets-context'

export default function TextFieldEditor({ term, setTerm, property }: WidgetProps) {
  const { language } = term as Literal
  const multiLine = property.out(dash('singleLine')).term?.value === 'false'

  return (
    <div className="inner">
      {multiLine ? (
        <textarea
          className="input"
          value={term.value}
          onChange={event => setTerm(factory.literal(event.target.value, language))}
        ></textarea>
      ) : (
        <input
          className="input"
          value={term.value}
          onChange={event => setTerm(factory.literal(event.target.value, language))}
        />
      )}
      <LanguageSelector onChange={newLanguage => setTerm(factory.literal(term.value, newLanguage))} value={language} />
    </div>
  )
}
