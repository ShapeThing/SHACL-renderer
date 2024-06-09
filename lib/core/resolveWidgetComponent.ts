import { use, useState } from 'react'
import { WidgetItem } from '../widgets/widgets-context'

export const resolveWidgetComponent = (widgetItem: WidgetItem) => {
  const [viewerPromise] = useState(() => widgetItem.Component().then(module => module.default))
  return use(viewerPromise)
}
