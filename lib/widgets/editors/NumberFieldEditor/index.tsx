import factory from '@rdfjs/data-model'
import { sh, xsd } from '../../../core/namespaces'
import { WidgetProps } from '../../widgets-context'

export default function NumberFieldEditor({ term, setTerm, property }: WidgetProps) {
  const datatype = property.out(sh('datatype')).term ?? xsd('decimal')

  return (
    <input
      className="input"
      type="number"
      value={term.value}
      onChange={event => setTerm(factory.literal(event.target.value, datatype))}
    />
  )
}
