import { use, useState } from 'react'
import { widgetsContext } from '../widgets/widgets-context'
import { dash, stf } from './namespaces'
import { resolveWidgetComponent } from './resolveWidgetComponent'
import { scoreWidgets } from './scoreWidgets'

const widgetPredicates = {
  editors: dash('editor'),
  viewers: dash('viewer'),
  facets: stf('facet')
}

export const getWidget = (type: keyof typeof widgetPredicates, property: GrapoiPointer, data: GrapoiPointer) => {
  const { [type]: widgets } = use(widgetsContext)
  const [widgetItem] = useState(() => scoreWidgets(widgets, data, property, widgetPredicates[type]))
  if (!widgetItem) return null
  return resolveWidgetComponent(widgetItem)
}
