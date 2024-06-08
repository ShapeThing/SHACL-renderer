import factory from '@rdfjs/data-model'
import { WidgetProps } from '../../widgets-context'

export default function TextFieldFacet({ term, setTerm }: WidgetProps) {
  return <input className="" value={term?.value} onChange={event => setTerm(factory.literal(event.target.value))} />
}
