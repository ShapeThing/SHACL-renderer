import { WidgetItem, WidgetMeta } from './widgets-context'

const coreWidgetMetaItems = import.meta.glob('./*/*/meta.ts', { eager: true })
const coreWidgetComponents = import.meta.glob('./*/*/index.tsx')

export const coreWidgets: {
  editors: WidgetItem[]
  viewers: WidgetItem[]
  facets: WidgetItem[]
} = {
  editors: [],
  viewers: [],
  facets: []
}

for (const [path, coreWidgetMeta] of Object.entries(coreWidgetMetaItems)) {
  const [, type, name] = path.split('/')
  const componentItem = Object.entries(coreWidgetComponents).find(([innerPath]) => {
    const [, innerType, innerName] = innerPath.split('/')
    return innerType === type && innerName === name
  })

  if (!componentItem) throw new Error(`Could not find component for ${name}`)

  coreWidgets[type as keyof typeof coreWidgets].push({
    meta: coreWidgetMeta as WidgetMeta,
    Component: componentItem[1]
  })
}