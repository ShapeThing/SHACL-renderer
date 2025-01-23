import factory from '@rdfjs/data-model'
import datasetFactory from '@rdfjs/dataset'
import { NamedNode } from '@rdfjs/types'
import grapoi, { Grapoi } from 'grapoi'
import { JsonLdContextNormalized } from 'jsonld-context-parser'
import type { ShaclRendererProps } from '../../components/ShaclRenderer'
import { initContext } from '../../core/main-context'
import { dash, prefixes, rdf, sh, xsd } from '../../core/namespaces'
import { scoreWidgets } from '../../core/scoreWidgets'
import parsePath from '../../helpers/parsePath'
import { coreWidgets } from '../../widgets/coreWidgets'

const cast = (datatype: NamedNode) => {
  if (datatype.equals(xsd('boolean'))) return 'boolean'
  if (datatype.equals(xsd('date'))) return 'Date'
  if (datatype.equals(xsd('integer'))) return 'number'
  if (datatype.equals(xsd('string'))) return 'string'
  if (datatype.equals(rdf('langString'))) return 'string'
  return 'string'
}

const nodeShape = (
  shapePointer: Grapoi,
  context: JsonLdContextNormalized,
  widgets: typeof coreWidgets,
  spacing: number = 2
) => {
  const properties: [number, any][] = [...shapePointer.out(sh('property'))].map((property: Grapoi) => [
    parseFloat(property.out(sh('order')).value ?? '0'),
    propertyShape(property, context, widgets, spacing)
  ])

  return properties
    .sort((a, b) => a[0] - b[0])
    .map(item => item[1])
    .filter(Boolean)
    .join('\n')
}

const propertyShape = (
  propertyPointer: Grapoi,
  context: JsonLdContextNormalized,
  widgets: typeof coreWidgets,
  spacing: number = 2
): string => {
  const path = parsePath(propertyPointer.out(sh('path')))

  // For now we can only deal with simple paths.
  if (path?.[0]?.predicates.length !== 1) return ''

  const predicate = path[0].predicates[0]
  const compactedPredicate = context.compactIri(predicate.value, true)

  const widget = scoreWidgets(widgets['editors'], undefined, propertyPointer)
  // We use dash:DetailsEditor here as an indication of a nested node vs. a reference.
  const mustRenderNode = widget?.meta.iri?.equals(dash('DetailsEditor'))
  let subType = undefined

  if (mustRenderNode) {
    const node = propertyPointer.out(sh('node')).term
    let nodeShapePointer: Grapoi

    if (!node) {
      const dataset = datasetFactory.dataset([
        factory.quad(factory.namedNode(propertyPointer.term.value), rdf('type'), sh('NodeShape'))
      ])
      nodeShapePointer = grapoi({ dataset, factory, term: factory.namedNode(propertyPointer.term.value) })
    } else {
      nodeShapePointer = propertyPointer.node(node)
    }

    subType = `{\n${nodeShape(nodeShapePointer, context, widgets, spacing + 1)}\n${' '.repeat(spacing * 2)}}`
  }

  const isMultiple = propertyPointer.out(sh('maxCount')).value !== '1'
  const dataType = cast(propertyPointer.out(sh('datatype')).term ?? xsd('string'))
  const isRequired =
    propertyPointer.out(sh('minCount')).value && parseInt(propertyPointer.out(sh('minCount')).value) > 0
  const property = ['.', ':'].some(char => compactedPredicate.includes(char))
    ? `'${compactedPredicate}'`
    : compactedPredicate

  return `${' '.repeat(spacing * 2)}${property}${isRequired ? '' : '?'}: ${
    isMultiple ? `Array<${subType ?? dataType}>` : subType ?? dataType
  }`
}

export async function toType(input: Omit<ShaclRendererProps, 'mode'>) {
  const { jsonLdContext, shapePointer, targetClass, shapeSubject } = await initContext({ ...input, mode: 'edit' })
  const widgets = coreWidgets
  const mergedContext = new JsonLdContextNormalized({
    ...prefixes,
    ...jsonLdContext.getContextRaw(),
    ...(input.context ?? {})
  })

  if (!targetClass && !shapeSubject) return ''

  return `export type ${targetClass?.value.split(/\/|\#/g).pop()} = {\n${nodeShape(
    shapePointer,
    mergedContext,
    widgets,
    1
  )}\n}`
}
