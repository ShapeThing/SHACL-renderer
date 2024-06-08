import { use, useState } from 'react'
import { scoreWidgets } from '../../core/scoreWidgets'
import { resolveWidgetComponent } from '../../helpers/resolveWidgetComponent'
import { widgetsContext } from '../../widgets/widgets-context'
import { PropertyShapeInnerProps } from '../PropertyShape'
import { dash } from '../ShaclRenderer'

type PropertyObjectEditModeProps = PropertyShapeInnerProps

export default function PropertyObjectEditMode({ data, property }: PropertyObjectEditModeProps) {
  const { editors } = use(widgetsContext)

  const [widgetItem] = useState(() => scoreWidgets(editors, data, property, dash('editor')))
  if (!widgetItem) return null
  const Editor = resolveWidgetComponent(widgetItem)

  return (
    <div key={data.term.value}>
      <Editor term={data.term} />
      <button>x</button>
    </div>
  )
}
