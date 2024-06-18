import factory from '@rdfjs/data-model'
import { xsd } from '../../../core/namespaces'
import { WidgetProps } from '../../widgets-context'

export default function DatePickerEditor({ term, setTerm }: WidgetProps) {
  return (
    <input
      className="input"
      type="date"
      value={term.value}
      onBlur={event => setTerm(factory.literal(event.target.value, xsd('date')))}
    />
  )
}
