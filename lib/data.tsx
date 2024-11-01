import { JsonLdContextNormalized } from 'jsonld-context-parser'
import ShaclRenderer, { rdf, ShaclRendererProps, xsd } from './components/ShaclRenderer'
import { initContext } from './core/main-context'
import { renderToAsyncBrowser } from './helpers/renderToStringAsyncBrowser'

const cast = (value: any, datatype?: string | null) => {
  if (!value || !datatype) return value
  if (datatype === xsd('boolean').value) return value === 'true'
  if (datatype === xsd('date').value) return new Date(value)
  if (datatype === xsd('integer').value) return parseInt(value)
  if (datatype === xsd('string').value) return value
  if (datatype === rdf('langString').value) return value
  return value
}

const xmlItemToObject = (node: Element, context: JsonLdContextNormalized): object => {
  const predicates = new Set([...node.children].map(child => child.getAttribute('data-predicate')!))
  const entries: [string, object | string | Date][] = []

  for (const predicate of predicates.values()) {
    const compactedPredicate = context.compactIri(predicate, true)
    const rawValues = [...node.children].filter(child => child.getAttribute('data-predicate') === predicate)
    const values = rawValues.map(child => {
      if (child.children?.[0]?.nodeName === 'main') {
        return xmlItemToObject(child.children?.[0], context)
      } else {
        const dataType = child.getAttribute('data-dataType')
        return cast(child.innerHTML, dataType)
      }
    })

    const isMultiple = rawValues[0].getAttribute('data-ismultiple') === 'true'
    entries.push([compactedPredicate, isMultiple ? values : values[0]])
  }

  return Object.fromEntries(entries)
}

export default async function data(input: ShaclRendererProps) {
  const context = await initContext(input)
  const result = await renderToAsyncBrowser(<ShaclRenderer {...input} mode="data" />)
  const parser = new DOMParser()
  const parsed = parser.parseFromString(result, 'application/xml')
  const mergedContext = new JsonLdContextNormalized({
    ...context.jsonLdContext.getContextRaw(),
    ...(input.context ?? {})
  })
  return xmlItemToObject(parsed.children[0], mergedContext)
}
