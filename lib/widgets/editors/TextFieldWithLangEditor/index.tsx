import factory from '@rdfjs/data-model'
import { Literal } from '@rdfjs/types'
import { WidgetProps } from '../../widgets-context'

export default function TextFieldEditor({ term, setTerm }: WidgetProps) {
  const { language } = term as Literal

  return (
    <>
      <input
        className="input"
        value={term.value}
        onBlur={event => setTerm(factory.literal(event.target.value, language))}
      />
    </>
  )
}
