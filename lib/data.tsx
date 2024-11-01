import { JsonLdContextNormalized } from 'jsonld-context-parser'
import { renderToStringAsync } from 'preact-render-to-string'
import ShaclRenderer, { rdf, ShaclRendererProps, xsd } from './components/ShaclRenderer'
import { initContext } from './core/main-context'

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
  const predicates = new Set([...node.children].map(child => child.getAttribute('predicate')!))
  const entries: [string, object | string | Date][] = []

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
  const context = await initContext(input)
  const result = await renderToStringAsync(<ShaclRenderer {...input} mode="data" />)
  console.log(result)
  const parser = new DOMParser()
  const parsed = parser.parseFromString(result, 'application/xml')
  const mergedContext = new JsonLdContextNormalized({
    ...context.jsonLdContext.getContextRaw(),
    ...(input.context ?? {})
  })
  return xmlItemToObject(parsed.children[0], mergedContext)
}
