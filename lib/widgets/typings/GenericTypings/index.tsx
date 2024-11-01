import parsePath from 'shacl-engine/lib/parsePath'
import { sh } from '../../../core/namespaces'
import { WidgetProps } from '../../widgets-context'

export default function GenericTypings({ property }: WidgetProps) {
  const path = parsePath(property.out(sh('path')))
  const predicate = path[0].predicates[0].value
  const isMultiple = property.out(sh('maxCount')).value !== '1'
  const isRequired = !!parseInt(property.out(sh('minCount')).value)
  const dataType = property.out(sh('datatype')).value

  return (
    <item
      dataType={dataType}
      isRequired={isRequired ? 'true' : 'false'}
      isMultiple={isMultiple ? 'true' : 'false'}
      predicate={predicate}
    ></item>
  )
}
