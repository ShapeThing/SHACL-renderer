import { useContext } from 'react'
import { dash, sh } from '../../core/namespaces'
import { scoreWidgets } from '../../core/scoreWidgets'
import { DiffableTerm } from '../../helpers/diffableTerm'
import parsePath from '../../helpers/parsePath'
import { wrapWithList } from '../../helpers/wrapWithList'
import { widgetsContext } from '../../widgets/widgets-context'
import PropertyElement from '../PropertyElement'
import type { PropertyShapeInnerProps } from '../PropertyShape'

export default function PropertyShapeViewMode(props: PropertyShapeInnerProps) {
  const { nodeDataPointer, property } = props
  const { viewers } = useContext(widgetsContext)
  const path = parsePath(property.out(sh('path')))
  const data = nodeDataPointer.executeAll(path)

  return data.ptrs.length ? (
    <PropertyElement showColon property={property}>
      {wrapWithList(
        data.map((item: any) => {
          const widgetItem = scoreWidgets(viewers, data, property, dash('viewer'))

          return widgetItem && item.term.value ? (
            <span className={`${(item.term as DiffableTerm).diffState ?? ''} term`}>
              <widgetItem.Component {...props} key={item.term.value} data={item} term={item.term} />
            </span>
          ) : null
        }),
        property
      )}
    </PropertyElement>
  ) : null
}
