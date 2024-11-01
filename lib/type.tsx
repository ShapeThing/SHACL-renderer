import { JsonLdContextNormalized } from 'jsonld-context-parser'
import { renderToStringAsync } from 'preact-render-to-string'
import ShaclRenderer, { rdf, ShaclRendererProps, xsd } from './components/ShaclRenderer'
import { initContext } from './core/main-context'

const cast = (datatype: string) => {
  if (datatype === xsd('boolean').value) return 'boolean'
  if (datatype === xsd('date').value) return 'Date'
  if (datatype === xsd('integer').value) return 'number'
  if (datatype === xsd('string').value) return 'string'
  if (datatype === rdf('langString').value) return 'string'
}

const xmlItemToObject = (node: Element, context: JsonLdContextNormalized, spacing: number): string => {
  const predicates = new Set([...node.children].map(child => child.getAttribute('predicate')!))
  const typings: string[] = []

  for (const predicate of predicates.values().filter(Boolean)) {
    const compactedPredicate = context.compactIri(predicate, true)
    const child = [...node.children].find(child => child.getAttribute('predicate') === predicate)!
    if (child.children?.[0]?.nodeName === 'node') {
      return xmlItemToObject(child.children?.[0], context, spacing + 1)
    }

    const dataType = cast(child.getAttribute('dataType')!)
    const isMultiple = child.getAttribute('isMultiple') === 'true'
    const isRequired = child.getAttribute('isRequired') === 'true'

    typings.push(
      `${' '.repeat(spacing * 2)}${compactedPredicate}${isRequired ? '' : '?'}: ${
        isMultiple ? `Array<${dataType}>` : dataType
      }`
    )
  }

  return typings.join('\n')
}

export default async function type(input: ShaclRendererProps) {
  const context = await initContext(input)
  const result = await renderToStringAsync(<ShaclRenderer {...input} mode="type" />)
  const parser = new DOMParser()
  const parsed = parser.parseFromString(result, 'application/xml')
  const mergedContext = new JsonLdContextNormalized({
    ...context.jsonLdContext.getContextRaw(),
    ...(input.context ?? {})
  })
  return `export type = {
${xmlItemToObject(parsed.children[0], mergedContext, 1)}
}`
}
