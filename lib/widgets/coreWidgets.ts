import { ComponentType, LazyExoticComponent } from 'react'
import { coreWidgetComponents, coreWidgetMetaItems } from './generated'
import { WidgetItem, WidgetProps } from './widgets-context'

export const coreWidgets: {
  editors: WidgetItem[]
  viewers: WidgetItem[]
  facets: WidgetItem[]
  lists: WidgetItem[]
  transformers: WidgetItem[]
  typings: WidgetItem[]
} = {
  editors: [],
  viewers: [],
  facets: [],
  lists: [],
  transformers: [],
  typings: []
}

for (const [path, coreWidgetMeta] of Object.entries(coreWidgetMetaItems)) {
  const [, type, name] = path.split('/')
  const componentItem = Object.entries(coreWidgetComponents).find(([innerPath]) => {
    const [, innerType, innerName] = innerPath.split('/')
    return innerType === type && innerName === name
  })!

  coreWidgets[type as keyof typeof coreWidgets].push({
    meta: coreWidgetMeta,
    Component: componentItem[1] as LazyExoticComponent<ComponentType<Partial<WidgetProps>>>
  })
}
