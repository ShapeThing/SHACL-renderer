import { ComponentType, lazy } from 'react'
import { WidgetItem, WidgetMeta, WidgetProps } from './widgets-context'

const coreWidgetMetaItems = import.meta.glob('./*/*/meta.ts', { eager: true })
const coreWidgetComponents = import.meta.glob('./*/*/index.tsx')

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
  })

  const widgetFetcher = componentItem![1] as () => Promise<{ default: ComponentType<Partial<WidgetProps>> }>

  coreWidgets[type as keyof typeof coreWidgets].push({
    meta: (coreWidgetMeta as any).default as WidgetMeta,
    Component: lazy(widgetFetcher)
  })
}
