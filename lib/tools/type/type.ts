/**
 * Generate a TypeScript type via a SHACL shape
 * @module
 */

import factory from '@rdfjs/data-model'
import datasetFactory from '@rdfjs/dataset'
import { language } from '@rdfjs/score'
import { NamedNode } from '@rdfjs/types'
import grapoi from 'grapoi'
import { JsonLdContextNormalized } from 'jsonld-context-parser'
import type { ShaclRendererProps } from '../../components/ShaclRenderer'
import { initContext } from '../../core/main-context'
import { dash, prefixes, rdf, rdfs, sh, xsd } from '../../core/namespaces'
import { scoreWidgets } from '../../core/scoreWidgets'
import Grapoi from '../../Grapoi'
import parsePath from '../../helpers/parsePath'
import { coreWidgets } from '../../widgets/coreWidgets'
import { TransformerOptions } from '../types'

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
  languageStringsToSingular: boolean,
  spacing: number = 2
) => {
  const properties: [number, any][] = [...shapePointer.out(sh('property'))].map((property: Grapoi) => [
    parseFloat(property.out(sh('order')).value ?? '0'),
    propertyShape(property, context, widgets, languageStringsToSingular, spacing)
  ])

  const iri = `${'  '.repeat(spacing)}iri: string\n`
  const mustBeIri = shapePointer.out(sh('nodeKind')).term?.equals(sh('IRI'))

  return (
    (mustBeIri ? iri : '') +
    properties
      .sort((a, b) => a[0] - b[0])
      .map(item => item[1])
      .filter(Boolean)
      .join('\n')
  )
}

const propertyShape = (
  propertyPointer: Grapoi,
  context: JsonLdContextNormalized,
  widgets: typeof coreWidgets,
  languageStringsToSingular: boolean,
  spacing: number = 2
): string => {
  const path = parsePath(propertyPointer.out(sh('path')))
  const comment = propertyPointer
    .out(rdfs('comment'))
    .best(language(['en', '', '*']))
    ?.value?.trim()

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

    subType = `{\n${nodeShape(
      nodeShapePointer,
      context,
      widgets,
      languageStringsToSingular,
      spacing + 1
    )}\n${' '.repeat(spacing * 2)}}`
  }

  const datatypeTerm = propertyPointer.out(sh('datatype')).term ?? xsd('string')
  const uniqueLanguage = !!propertyPointer.out(sh('uniqueLang')).value
  let isMultiple = propertyPointer.out(sh('maxCount')).value !== '1'

  if (languageStringsToSingular && uniqueLanguage && datatypeTerm.equals(rdf('langString'))) {
    isMultiple = false
  }

  const dataType = cast(datatypeTerm)
  const isRequired =
    propertyPointer.out(sh('minCount')).value && parseInt(propertyPointer.out(sh('minCount')).value) > 0
  const property = ['.', ':'].some(char => compactedPredicate.includes(char))
    ? `'${compactedPredicate}'`
    : compactedPredicate

  return `${comment ? `${' '.repeat(spacing * 2)}/** ${comment} */\n` : ''}${' '.repeat(spacing * 2)}${property}${
    isRequired ? '' : '?'
  }: ${isMultiple ? `Array<${subType ?? dataType}>` : subType ?? dataType}`
}

export async function toType(
  input: Omit<ShaclRendererProps, 'mode'> & TransformerOptions
): Promise<{ target: NamedNode; type: string } | undefined> {
  const { jsonLdContext, shapePointer, targetClass } = await initContext({ ...input, mode: 'edit' })
  const widgets = coreWidgets
  const mergedContext = new JsonLdContextNormalized({
    ...prefixes,
    ...jsonLdContext.getContextRaw(),
    ...(input.context ?? {})
  })

  if (!targetClass) return undefined

  return {
    target: targetClass,
    type: `export type ${targetClass?.value.split(/\/|\#/g).pop()} = {\n${nodeShape(
      shapePointer,
      mergedContext,
      widgets,
      !!input.languageStringsToSingular,
      1
    )}\n}`
  }
}
