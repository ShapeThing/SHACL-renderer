import factory from '@rdfjs/data-model'
import { WidgetProps } from '../../widgets-context'

export default function TextFieldEditor({ term, setTerm }: WidgetProps) {
  return <input className="input" value={term.value} onBlur={event => setTerm(factory.literal(event.target.value))} />
}
