import factory from '@rdfjs/data-model'
import { dash } from '../../../core/namespaces'
import { WidgetProps } from '../../widgets-context'

export default function TextFieldEditor({ term, setTerm, property }: WidgetProps) {
  const multiLine = property.out(dash('singleLine')).term?.value === 'false'

  return multiLine ? (
    <textarea
      rows={4}
      className="input"
      value={term.value}
      onChange={event => setTerm(factory.literal(event.target.value))}
    />
  ) : (
    <input className="input" value={term.value} onChange={event => setTerm(factory.literal(event.target.value))} />
  )
}
