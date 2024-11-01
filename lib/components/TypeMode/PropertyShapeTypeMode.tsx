import parsePath from 'shacl-engine/lib/parsePath'
import { sh } from '../../core/namespaces'
import { PropertyShapeInnerProps } from '../PropertyShape'

declare global {
  namespace React.JSX {
    interface IntrinsicElements {
      node: any
      item: any
    }
  }
}

export default function PropertyShapeTypeMode(props: PropertyShapeInnerProps) {
  const { property } = props
  const path = parsePath(property.out(sh('path')))
  if (path[0].predicates.length !== 1) return

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
