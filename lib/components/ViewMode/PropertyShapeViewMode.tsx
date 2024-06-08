import { use, useState } from 'react'
import { scoreWidgets } from '../../core/scoreWidgets'
import { resolveWidgetComponent } from '../../helpers/resolveWidgetComponent'
import { wrapWithList } from '../../helpers/wrapWithList'
import { widgetsContext } from '../../widgets/widgets-context'
import PropertyElement from '../PropertyElement'
import { PropertyShapeInnerProps } from '../PropertyShape'
import { dash } from '../ShaclRenderer'

export default function PropertyShapeViewMode({ data, property }: PropertyShapeInnerProps) {
  const { viewers } = use(widgetsContext)

  const items = data.map(item => {
    const [widgetItem] = useState(() => scoreWidgets(viewers, item, property, dash('viewer')))
    if (!widgetItem) return null

    const Viewer = resolveWidgetComponent(widgetItem)
    return <Viewer key={item.term.value} term={item.term} />
  })
  return (
    <PropertyElement showColon property={property}>
      {wrapWithList(items, property)}
    </PropertyElement>
  )
}
