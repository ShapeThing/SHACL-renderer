import factory from '@rdfjs/data-model'
import { Term } from '@rdfjs/types'
import { Grapoi } from 'grapoi'
import { rdfs, sh } from '../../../core/namespaces'
import { WidgetProps } from '../../widgets-context'

export default function EnumSelectEditor({ property, term, setTerm }: WidgetProps) {
  /** @ts-ignore */
  const options: Term[] = [...property.out(sh('in')).list()].map((pointer: Grapoi) => pointer.term)

  return (
    <select
      className="input"
      value={term.value}
      onChange={event => {
        setTerm(
          options[0].termType === 'NamedNode'
            ? factory.namedNode(event.target.value)
            : factory.literal(event.target.value)
        )
      }}
    >
      {!term.value ? (
        <option disabled value={''}>
          - Pick an option -
        </option>
      ) : null}
      {options.map((term: Term) => {
        const label = property.node(term).out([sh('name'), rdfs('label')]).values[0]
        return (
          <option key={term.value} value={term.value}>
            {label ?? term.value}
          </option>
        )
      })}
    </select>
  )
}
