import factory from '@rdfjs/data-model'
import { WidgetProps } from '../../widgets-context'

export default function DateFacet({ term, setTerm }: WidgetProps) {
  return (
    <>
      <input
        type="date"
        className=""
        value={term?.value}
        onChange={event => setTerm(factory.literal(event.target.value))}
      />
      <input
        type="date"
        className=""
        value={term?.value}
        onChange={event => setTerm(factory.literal(event.target.value))}
      />
    </>
  )
}
