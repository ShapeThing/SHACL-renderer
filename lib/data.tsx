import { DatasetCore } from '@rdfjs/types'
import { JsonLdContextNormalized } from 'jsonld-context-parser'
import { renderToStringAsync } from 'preact-render-to-string'
import ShaclRenderer from './components/ShaclRenderer'
import { initContext } from './core/main-context'

const xmlItemToObject = (node: Element, context: JsonLdContextNormalized): any => {
  return Object.fromEntries(
    [...node.children].map((child: Element) => {
      const compactedPredicate = context.compactIri(child.getAttribute('predicate')!, true)

      if (child.children?.[0]?.nodeName === 'node') {
        const data = xmlItemToObject(child.children?.[0], context)
        return [compactedPredicate, data]
      }

      return [compactedPredicate, child.innerHTML]
    })
  )
}

export default async function data(
  input: {
    shapes: URL | DatasetCore | string
    shapeSubject?: URL | string
    data?: URL | DatasetCore | string
  },
  additionalJsonLdContext: Record<string, string> = {}
) {
  /** @ts-ignore */
  const context = await initContext(input)
  const result = await renderToStringAsync(<ShaclRenderer {...input} mode="data" />)
  const parser = new DOMParser()
  const parsed = parser.parseFromString(result, 'application/xml')
  const mergedContext = new JsonLdContextNormalized({
    ...context.jsonLdContext.getContextRaw(),
    ...additionalJsonLdContext
  })
  return xmlItemToObject(parsed.children[0], mergedContext)
}
