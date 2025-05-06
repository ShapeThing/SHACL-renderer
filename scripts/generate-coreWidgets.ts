const widgetsMain = Deno.readDir('./lib/widgets')

const widgetNames: string[] = []

for await (const widgetType of widgetsMain) {
  if (!widgetType.isDirectory) continue

  const widgets = Deno.readDir(`./lib/widgets/${widgetType.name}/`)
  for await (const widget of widgets) {
    widgetNames.push(`./${widgetType.name}/${widget.name}`)
  }
}

const code = `import { lazy } from 'react'

${widgetNames
  .map(filename => {
    const widgetName = filename.split('/').pop()!
    return `import ${widgetName} from '${filename}/meta'`
  })
  .join('\n')}


export const coreWidgetMetaItems = {\n${widgetNames
  .map(filename => {
    const widgetName = filename.split('/').pop()!

    return `  '${filename}/meta.ts': ${widgetName},`
  })
  .join('\n')}\n}

export const coreWidgetComponents = {\n${widgetNames
  .map(widgetName => `  '${widgetName}/index.tsx': lazy(() => import('${widgetName}/index')),`)
  .join('\n')}\n}

`

await Deno.writeTextFile('./lib/widgets/generated.ts', code)
