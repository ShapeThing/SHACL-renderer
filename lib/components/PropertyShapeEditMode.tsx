import { use, useState } from 'react'
import { scoreWidgets } from '../core/scoreWidgets'
import { resolveWidgetComponent } from '../helpers/resolveWidgetComponent'
import { widgetsContext } from '../widgets/widgets-context'
import PropertyElement from './PropertyElement'
import { PropertyShapeInnerProps } from './PropertyShape'

export default function PropertyShapeEditMode({ data, property }: PropertyShapeInnerProps) {
  const { editors } = use(widgetsContext)

  const items = data.map(item => {
    const [widgetItem] = useState(() => scoreWidgets(editors, data, property))
    if (!widgetItem) return null
    const Editor = resolveWidgetComponent(widgetItem)

    return (
      <div key={item.term.value}>
        <Editor term={item.term} />
      </div>
    )
  })

  return (
    <PropertyElement property={property}>
      <div className="editors">{items}</div>
    </PropertyElement>
  )
}
