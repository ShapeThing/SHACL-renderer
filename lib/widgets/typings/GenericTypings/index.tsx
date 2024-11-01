import { sh } from '../../../core/namespaces'
import parsePath from '../../../helpers/parsePath'
import { WidgetProps } from '../../widgets-context'

export default function GenericTypings({ property }: WidgetProps) {
  const path = parsePath(property.out(sh('path')))
  const predicate = path[0].predicates[0].value
  const isMultiple = property.out(sh('maxCount')).value !== '1'
  const isRequired = !!parseInt(property.out(sh('minCount')).value)
  const dataType = property.out(sh('datatype')).value

  return (
    <div
      data-datatype={dataType}
      data-isrequired={isRequired ? 'true' : 'false'}
      data-ismultiple={isMultiple ? 'true' : 'false'}
      data-predicate={predicate}
    ></div>
  )
}
