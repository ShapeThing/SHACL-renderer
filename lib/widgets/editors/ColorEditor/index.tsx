import factory from '@rdfjs/data-model'
import { stsr } from '../../../core/namespaces'
import { WidgetProps } from '../../widgets-context'

export default function ColorEditor({ term, setTerm }: WidgetProps) {
  return (
    <input
      className="input"
      type="color"
      value={term.value}
      onBlur={event => setTerm(factory.literal(event.target.value, stsr('color')))}
    />
  )
}
