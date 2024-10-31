import { useContext } from 'react'
import parsePath from 'shacl-engine/lib/parsePath'
import { dash, sh } from '../../core/namespaces'
import { scoreWidgets } from '../../core/scoreWidgets'
import { widgetsContext } from '../../widgets/widgets-context'
import { PropertyShapeInnerProps } from '../PropertyShape'

declare global {
  namespace React.JSX {
    interface IntrinsicElements {
      node: any
      item: any
    }
  }
}

export default function PropertyShapeDataMode(props: PropertyShapeInnerProps) {
  const { nodeDataPointer, property } = props
  const { transformers } = useContext(widgetsContext)
  const path = parsePath(property.out(sh('path')))
  const data = nodeDataPointer.executeAll(path)

  if (path[0].predicates.length !== 1) return

  const predicate = path[0].predicates[0].value
  const isMultiple = property.out(sh('maxCount')).value !== '1'

  const results = data.map((item: any) => {
    const widgetItem = scoreWidgets(transformers, data, property, dash('viewer'))
    if (!widgetItem) return
    const result = <widgetItem.Component {...props} key={item.term.value} data={item} term={item.term} />

    return widgetItem ? (
      <item dataType={item.term.datatype?.value} isMultiple={isMultiple ? 'true' : 'false'} predicate={predicate}>
        {result}
      </item>
    ) : null
  })

  return isMultiple ? results : results[0]
}
