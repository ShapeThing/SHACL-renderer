import { ComponentType, lazy } from 'react'
import { WidgetItem, WidgetMeta, WidgetProps } from './widgets-context'

const isNode = typeof import.meta.glob !== 'function'

if (isNode && import.meta.env.DEV) {
  /** @ts-expect-error Too lazy to type this correctly */
  import.meta.glob = async function (pattern: string, options: { eager?: boolean } = {}) {
    const { glob } = await import('glob')
    const files = await glob(pattern, { cwd: './lib/widgets' })
    const modules = files.map(async file => [
      './' + file,
      options.eager ? await import(/* @vite-ignore */ './' + file) : () => import(/* @vite-ignore */ './' + file)
    ])

    return Object.fromEntries(await Promise.all(modules))
  }
}

const coreWidgetMetaItems = isNode
  ? await import.meta.glob('./*/*/meta.ts', { eager: true })
  : import.meta.glob('./*/*/meta.ts', { eager: true })
const coreWidgetComponents = isNode ? await import.meta.glob('./*/*/index.tsx') : import.meta.glob('./*/*/index.tsx')

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
    meta: (coreWidgetMeta as { default: WidgetMeta }).default,
    Component: lazy(widgetFetcher)
  })
}
