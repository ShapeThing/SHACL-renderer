import { useContext } from 'react'
import parsePath from 'shacl-engine/lib/parsePath'
import { dash, sh } from '../../core/namespaces'
import { scoreWidgets } from '../../core/scoreWidgets'
import { widgetsContext } from '../../widgets/widgets-context'
import { PropertyShapeInnerProps } from '../PropertyShape'

export default function PropertyShapeDataMode(props: PropertyShapeInnerProps) {
  const { nodeDataPointer, property } = props
  const { transformers } = useContext(widgetsContext)
  const path = parsePath(property.out(sh('path')))
  const data = nodeDataPointer.executeAll(path)

  if (path[0].predicates.length !== 1) return

  const predicate = path[0].predicates[0].value

  return data.map((item: any) => {
    const widgetItem = scoreWidgets(transformers, data, property, dash('viewer'))
    if (!widgetItem) return
    const result = <widgetItem.Component {...props} key={item.term.value} data={item} term={item.term} />

    return widgetItem ? (
      /** @ts-ignore */
      <item predicate={predicate}>{result}</item>
    ) : null
  })
}
