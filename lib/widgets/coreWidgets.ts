import { ComponentType, lazy } from 'react'
import { WidgetItem, WidgetMeta, WidgetProps } from './widgets-context'

const coreWidgetMetaItems = import.meta.glob('./*/*/meta.ts', { eager: true })
const coreWidgetComponents = import.meta.glob('./*/*/index.tsx')

export const coreWidgets: {
  editors: WidgetItem[]
  viewers: WidgetItem[]
  facets: WidgetItem[]
  lists: WidgetItem[]
} = {
  editors: [],
  viewers: [],
  facets: [],
  lists: []
}

for (const [path, coreWidgetMeta] of Object.entries(coreWidgetMetaItems)) {
  const [, type, name] = path.split('/')
  const componentItem = Object.entries(coreWidgetComponents).find(([innerPath]) => {
    const [, innerType, innerName] = innerPath.split('/')
    return innerType === type && innerName === name
  })

  coreWidgets[type as keyof typeof coreWidgets].push({
    meta: coreWidgetMeta as WidgetMeta,
    Component: lazy(componentItem![1] as () => Promise<{ default: ComponentType<WidgetProps> }>)
  })
}
