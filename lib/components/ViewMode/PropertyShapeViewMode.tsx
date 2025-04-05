import { dash, sh } from '../../core/namespaces'
import { DiffableTerm } from '../../helpers/diffableTerm'
import parsePath from '../../helpers/parsePath'
import { wrapWithList } from '../../helpers/wrapWithList'
import { useWidget } from '../EditMode/PropertyShapeEditMode'
import PropertyElement from '../PropertyElement'
import type { PropertyShapeInnerProps } from '../PropertyShape'

export default function PropertyShapeViewMode(props: PropertyShapeInnerProps) {
  const { nodeDataPointer, property } = props
  const path = parsePath(property.out(sh('path')))
  const data = nodeDataPointer.executeAll(path)

  return data.ptrs.length ? (
    <PropertyElement showColon property={property}>
      {wrapWithList(
        data.map((item: any) => {
          const widgetItem = useWidget(dash('viewer'))(property, data)

          return widgetItem && item.term.value ? (
            <span key={item.term.value} className={`${(item.term as DiffableTerm).diffState ?? ''} term`}>
              <widgetItem.Component {...props} key={item.term.value} data={item} term={item.term} />
            </span>
          ) : null
        }),
        property
      )}
    </PropertyElement>
  ) : null
}
