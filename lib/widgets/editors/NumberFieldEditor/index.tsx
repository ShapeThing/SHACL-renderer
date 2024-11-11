import factory from '@rdfjs/data-model'
import { xsd } from '../../../core/namespaces'
import { WidgetProps } from '../../widgets-context'

export default function NumberFieldEditor({ term, setTerm }: WidgetProps) {
  return (
    <input
      className="input"
      type="number"
      value={term.value}
      autoFocus
      onChange={event => setTerm(factory.literal(event.target.value, xsd('decimal')))}
    />
  )
}
