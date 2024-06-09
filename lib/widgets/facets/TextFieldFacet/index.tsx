import { sh } from '../../../core/namespaces'
import { WidgetProps } from '../../widgets-context'

export default function TextFieldFacet({ data, setConstraint }: WidgetProps) {
  const pattern = data.out(sh('pattern')).value ?? ''

  return <input className="" value={pattern} onChange={event => setConstraint(sh('pattern'), event.target.value)} />
}
