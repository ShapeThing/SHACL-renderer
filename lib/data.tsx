import { JsonLdContextNormalized } from 'jsonld-context-parser'
import { renderToStringAsync } from 'preact-render-to-string'
import ShaclRenderer, { ShaclRendererProps } from './components/ShaclRenderer'
import { initContext } from './core/main-context'

const cast = (value: any, datatype?: string | null) => {
  if (!value || !datatype) return value
  if (datatype === 'http://www.w3.org/2001/XMLSchema#boolean') return value === 'true'
  if (datatype === 'http://www.w3.org/2001/XMLSchema#date') return new Date(value)
  if (datatype === 'http://www.w3.org/2001/XMLSchema#integer') return parseInt(value)
  if (datatype === 'http://www.w3.org/2001/XMLSchema#string') return value
  if (datatype === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString') return value
  return value
}

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
        const dataType = child.getAttribute('dataType')
        return cast(child.innerHTML, dataType)
      }
    })

    const isMultiple = rawValues[0].getAttribute('isMultiple') === 'true'
    entries.push([compactedPredicate, isMultiple ? values : values[0]])
  }

  return Object.fromEntries(entries)
}

export default async function data(input: ShaclRendererProps) {
  /** @ts-ignore */
  const context = await initContext(input)
  const result = await renderToStringAsync(<ShaclRenderer {...(input as any)} mode="data" />)
  const parser = new DOMParser()
  const parsed = parser.parseFromString(result, 'application/xml')
  const mergedContext = new JsonLdContextNormalized({
    ...context.jsonLdContext.getContextRaw(),
    ...(input.context ?? {})
  })
  return xmlItemToObject(parsed.children[0], mergedContext)
}
