import factory from '@rdfjs/data-model'
import { stsr } from '../../../core/namespaces'
import { WidgetProps } from '../../widgets-context'

export default function ColorEditor({ term, setTerm }: WidgetProps) {
  return (
    <div
      className="input"
      /** @ts-ignore */
      style={{ '--color': term.value }}
    >
      <input
        type="color"
        value={term.value}
        onChange={event => setTerm(factory.literal(event.target.value, stsr('color')))}
      />
    </div>
  )
}
