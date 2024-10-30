import { DatasetCore } from '@rdfjs/types'
import { JsonLdContextNormalized } from 'jsonld-context-parser'
import { renderToStringAsync } from 'preact-render-to-string'
import ShaclRenderer from './components/ShaclRenderer'
import { initContext } from './core/main-context'

const xmlItemToObject = (node: Element, context: JsonLdContextNormalized): any => {
  const predicates = new Set([...node.children].map(child => child.getAttribute('predicate')!))

  const entries: [string, any][] = []

  for (const predicate of predicates.values()) {
    const compactedPredicate = context.compactIri(predicate, true)
    const rawValues = [...node.children].filter(child => child.getAttribute('predicate') === predicate)
    const values = rawValues.map(child => {
      if (child.children?.[0]?.nodeName === 'node') {
        return xmlItemToObject(child.children?.[0], context)
      } else {
        return child.innerHTML
      }
    })

    const isMultiple = rawValues[0].getAttribute('isMultiple') === 'true'
    entries.push([compactedPredicate, isMultiple ? values : values[0]])
  }

  return Object.fromEntries(entries)
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
