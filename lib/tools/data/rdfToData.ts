import factory from '@rdfjs/data-model'
import datasetFactory from '@rdfjs/dataset'
import { Literal, Term } from '@rdfjs/types'
import grapoi, { Grapoi } from 'grapoi'
import { JsonLdContextNormalized } from 'jsonld-context-parser'
import type { ShaclRendererProps } from '../../components/ShaclRenderer'
import { initContext } from '../../core/main-context'
import { dash, prefixes, rdf, sh, xsd } from '../../core/namespaces'
import { scoreWidgets } from '../../core/scoreWidgets'
import { isOrderedList } from '../../helpers/isOrderedList'
import parsePath from '../../helpers/parsePath'
import { coreWidgets } from '../../widgets/coreWidgets'
import { TransformerOptions } from '../types'

const cast = (value: Term) => {
  const datatype = (value as Literal).datatype
  if (!value || !datatype) return value.value
  if (datatype.equals(xsd('boolean'))) return value.value === 'true' || value.value === '1'
  if (datatype.equals(xsd('date'))) return new Date(value.value)
  if (datatype.equals(xsd('integer'))) return parseInt(value.value)
  if (datatype.equals(xsd('decimal'))) return parseFloat(value.value)
  if (datatype.equals(xsd('string'))) return value.value
  if (datatype.equals(rdf('langString'))) return value.value
  return value.value
}

const nodeShape = (
  shapePointer: Grapoi,
  dataPointer: Grapoi,
  context: JsonLdContextNormalized,
  widgets: typeof coreWidgets,
  activeContentLanguage?: string
) => {
  const isClosed = shapePointer.out(sh('closed')).value === 'true'
  const properties = shapePointer.out(sh('property'))
  const usedPredicates = new Set([...properties].map(property => property.out(sh('path')).value))

  const normalProperties: [number, any][] = [...properties].map((property: Grapoi) => [
    parseFloat(property.out(sh('order')).value ?? '0'),
    propertyShape(property, dataPointer, context, widgets, activeContentLanguage)
  ])

  const predicatesWithoutNodeShapes = new Map(
    [...dataPointer.out().quads()]
      .filter(quad => !usedPredicates.has(quad.predicate.value))
      .map(quad => [quad.predicate.value, quad.predicate])
  )

  const propertiesWithoutPropertyShapes: [number, any][] = !isClosed
    ? [...predicatesWithoutNodeShapes.values()].map(predicate => {
        const dataset = shapePointer.ptrs[0].dataset
        const propertyIri = factory.namedNode(`int:${predicate.value}`)

        const quads = [
          factory.quad(factory.namedNode(''), sh('property'), propertyIri),
          factory.quad(propertyIri, rdf('type'), sh('PropertyShape')),
          factory.quad(propertyIri, sh('path'), predicate)
        ]
        for (const quad of quads) dataset.add(quad)

        const property = grapoi({ dataset, factory, term: propertyIri })
        return [0, propertyShape(property, dataPointer, context, widgets, activeContentLanguage)]
      })
    : []

  const allProperties = [...propertiesWithoutPropertyShapes, ...normalProperties]
    .filter(item => item[1])
    .sort((a, b) => b[0] - a[0])
    .map(item => item[1])

  return Object.assign({}, ...allProperties)
}

const propertyShape = (
  propertyPointer: Grapoi,
  dataPointer: Grapoi,
  context: JsonLdContextNormalized,
  widgets: typeof coreWidgets,
  activeContentLanguage?: string
): object => {
  let path = parsePath(propertyPointer.out(sh('path'))) as any

  const isList = isOrderedList(path)
  if (isList) path = [path[0]]

  // For now we can only deal with simple paths.
  if (path?.[0]?.predicates.length !== 1) return {}

  let items = dataPointer.executeAll(path)

  if (activeContentLanguage) {
    items = items.filter(item => {
      if (!(item.term as Literal)?.language) return true
      return (item.term as Literal)?.language === activeContentLanguage
    })
  }

  const predicate = path?.[0]?.predicates[0]!
  const compactedPredicate = context.compactIri(predicate.value, true)
  const materializedItems = isList ? [...items.list()] : items

  const values = materializedItems.map((item: Grapoi) => {
    const widget = scoreWidgets(widgets['editors'], item, propertyPointer, dash('editor'))
    const mustRenderNode = widget?.meta.iri?.equals(dash('DetailsEditor'))

    if (mustRenderNode) {
      const node = propertyPointer.out(sh('node')).term
      let nodeShapePointer: Grapoi

      if (!node) {
        const dataset = datasetFactory.dataset([
          factory.quad(factory.namedNode(item.term.value), rdf('type'), sh('NodeShape'))
        ])
        nodeShapePointer = grapoi({ dataset, factory, term: factory.namedNode(item.term.value) })
      } else {
        nodeShapePointer = propertyPointer.node(node)
      }

      const subItem = nodeShape(nodeShapePointer, item, context, widgets, activeContentLanguage)
      return subItem
    } else {
      return cast(item.term)
    }
  })

  if (!values.length) return {}

  let multiple = propertyPointer.out(sh('maxCount')).value !== '1'
  const datatypeTerm = propertyPointer.out(sh('datatype')).term ?? xsd('string')

  if (activeContentLanguage && datatypeTerm.equals(rdf('langString'))) multiple = false

  return {
    [compactedPredicate]: multiple ? values : values[0]
  }
}

export async function rdfToData(input: Omit<ShaclRendererProps, 'mode'> & TransformerOptions) {
  const { jsonLdContext, shapePointer, dataPointer } = await initContext({ ...input, mode: 'edit' })
  const widgets = coreWidgets
  const mergedContext = new JsonLdContextNormalized({
    ...prefixes,
    ...jsonLdContext.getContextRaw(),
    ...(input.context ?? {})
  })

  return nodeShape(shapePointer, dataPointer, mergedContext, widgets, input.activeContentLanguage)
}
