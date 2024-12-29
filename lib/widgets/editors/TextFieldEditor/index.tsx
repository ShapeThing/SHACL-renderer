import factory from '@rdfjs/data-model'
import { dash, sh } from '../../../core/namespaces'
import { WidgetProps } from '../../widgets-context'

export default function TextFieldEditor({ term, setTerm, property }: WidgetProps) {
  const multiLine = property.out(dash('singleLine')).term?.value === 'false'
  const maxLength = property.out(sh('maxLength')).value ? parseInt(property.out(sh('maxLength')).value) : undefined

  return multiLine ? (
    <textarea
      rows={4}
      maxLength={maxLength}
      className="input"
      value={term.value}
      onChange={event => setTerm(factory.literal(event.target.value))}
    />
  ) : (
    <input
      className="input"
      maxLength={maxLength}
      size={maxLength}
      value={term.value}
      onChange={event => setTerm(factory.literal(event.target.value))}
    />
  )
}
