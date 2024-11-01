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
    let subType = undefined

    const subNode = child.children?.[0]
    if (subNode?.nodeName === 'node') {
      const subTypeProperties = xmlItemToObject(subNode, context, spacing + 1)
      subType = `{\n${subTypeProperties}\n${' '.repeat(spacing * 2)}}`
    }

    const dataType = cast(child.getAttribute('dataType')!) ?? 'string'
    const isMultiple = child.getAttribute('isMultiple') === 'true'
    const isRequired = child.getAttribute('isRequired') === 'true'

    const property = compactedPredicate.includes('.') ? `'${compactedPredicate}'` : compactedPredicate

    typings.push(
      `${' '.repeat(spacing * 2)}${property}${isRequired ? '' : '?'}: ${
        isMultiple ? `Array<${subType ?? dataType}>` : subType ?? dataType
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
  const node = parsed.children[0]
  return `export type ${node.getAttribute('name')} = {\n${xmlItemToObject(node, mergedContext, 1)}\n}`
}
