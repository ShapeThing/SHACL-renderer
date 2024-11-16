import factory from '@rdfjs/data-model'
import { Term } from '@rdfjs/types'
import { Grapoi } from 'grapoi'
import { sh } from '../../../core/namespaces'
import { WidgetProps } from '../../widgets-context'

export default function EnumSelectEditor({ property, term, setTerm }: WidgetProps) {
  /** @ts-ignore */
  const options: Term[] = [...property.out(sh('in')).list()].map((pointer: Grapoi) => pointer.term)

  return (
    <select className="input" value={term.value} onChange={event => setTerm(factory.literal(event.target.value))}>
      {!term.value ? (
        <option disabled value={''}>
          - Pick an option -
        </option>
      ) : null}
      {options.map((term: Term) => (
        <option key={term.value}>{term.value}</option>
      ))}
    </select>
  )
}
