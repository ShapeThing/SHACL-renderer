import factory from '@rdfjs/data-model'
import { WidgetProps } from '../../widgets-context'

export default function CountFacet({ term, setTerm, searchData }: WidgetProps) {
  console.log(searchData)

  return <input className="" value={term?.value} onChange={event => setTerm(factory.literal(event.target.value))} />
}
