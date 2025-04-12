import factory from '@rdfjs/data-model'
import { CSSProperties } from 'react'
import { stsr } from '../../../core/namespaces'
import { WidgetProps } from '../../widgets-context'

export default function ColorEditor({ term, setTerm }: WidgetProps) {
  return (
    <div className="input" style={{ '--color': term.value } as CSSProperties}>
      <input
        type="color"
        value={term.value}
        onChange={event => setTerm(factory.literal(event.target.value, stsr('color')))}
      />
    </div>
  )
}
