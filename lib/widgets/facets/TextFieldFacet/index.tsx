import factory from '@rdfjs/data-model'
import { WidgetProps } from '../../widgets-context'

export default function TextFieldFacet({ term, setTerm, searchData }: WidgetProps) {
  // console.log(searchData.values)
  return <input className="" value={''} onChange={event => setTerm(factory.literal(event.target.value))} />
}
