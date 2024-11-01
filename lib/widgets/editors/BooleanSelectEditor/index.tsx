import factory from '@rdfjs/data-model'
import { xsd } from '../../../core/namespaces'
import { WidgetProps } from '../../widgets-context'

export default function BooleanSelectEditor({ term, setTerm }: WidgetProps) {
  const currentValue = term.value === '1' || term.value === 'true'

  return (
    <input
      type="checkbox"
      className="input"
      checked={currentValue}
      onChange={event => setTerm(factory.literal(event.target.checked ? 'true' : 'false', xsd('boolean')))}
    />
  )
}
