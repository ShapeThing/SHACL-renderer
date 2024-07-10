import dataFactory from '@rdfjs/data-model'
import { WidgetProps } from '../../widgets-context'

export default function NumberFieldEditor({ setTerm }: WidgetProps) {
  return (
    <>
      <button onClick={() => setTerm(dataFactory.literal(''))}>String</button>
    </>
  )
}
