import factory from '@rdfjs/data-model'
import { BlankNode, DatasetCore, NamedNode, Quad, Quad_Object } from '@rdfjs/types'
import { Grapoi } from 'grapoi'
import { JsonLdContextNormalized } from 'jsonld-context-parser'
import { initContext } from '../../core/main-context'
import { dash, prefixes, rdf, sh, xsd } from '../../core/namespaces'
import { scoreWidgets } from '../../core/scoreWidgets'
import { isOrderedList } from '../../helpers/isOrderedList'
import parsePath from '../../helpers/parsePath'
import { coreWidgets } from '../../widgets/coreWidgets'

export const cast = (value: any, datatype: NamedNode) => {
  if (datatype.equals(xsd('boolean'))) return value ? 'true' : 'false'
  if (datatype.equals(xsd('date')))
    return `${value.getFullYear()}-${(value.getMonth() + 1).toString().padStart(2, '0')}-${value
      .getDate()
      .toString()
      .padStart(2, '0')}`
  if (datatype.equals(xsd('integer'))) return parseInt(value)
  if (datatype.equals(xsd('decimal'))) return parseFloat(value)
  if (datatype.equals(xsd('string'))) return value
  if (datatype.equals(rdf('langString'))) return value
  return value
}

export async function dataToRdf({
  data,
  shapes,
  shapeSubject,
  context: givenContext,
  subject
}: {
  data: any
  shapes: URL | DatasetCore | string
  shapeSubject?: URL | string
  context?: Record<string, string>
  subject?: NamedNode | BlankNode
}) {
  const mainContext = await initContext({
    shapes,
    shapeSubject,
    context: givenContext,
    mode: 'edit'
  })
  const { jsonLdContext, shapePointer } = mainContext
  const widgets = coreWidgets
  const context = new JsonLdContextNormalized({
    ...prefixes,
    ...jsonLdContext.getContextRaw(),
    ...(givenContext ?? {})
  })
  const activeContentLanguage = Object.keys(mainContext.contentLanguages).length
    ? Object.keys(mainContext.contentLanguages)[0]
    : 'en'

  if (!subject) subject = factory.namedNode('#')

  return nodeShape(shapePointer, context, data, widgets, subject, activeContentLanguage)
}

const nodeShape = (
  shapePointer: Grapoi,
  context: JsonLdContextNormalized,
  data: any,
  widgets: typeof coreWidgets,
  subject: NamedNode | BlankNode,
  activeContentLanguage: string
) => {
  const quads: Quad[] = []

  for (const property of [...shapePointer.out(sh('property'))]) {
    let path = parsePath(property.out(sh('path'))) as any

    const predicate = path[0].predicates[0]
    const compactedPredicate = context.compactIri(predicate.value, true)
    if (!data[compactedPredicate]) continue

    const values = Array.isArray(data[compactedPredicate]) ? data[compactedPredicate] : [data[compactedPredicate]]

    const widget = scoreWidgets(widgets['editors'], undefined, property, dash('editor'))
    const mustRenderNode = widget?.meta.iri?.equals(dash('DetailsEditor'))
    const isList = isOrderedList(path)

    if (isList) path = [path[0]]

    const datatype = property.out(sh('datatype')).term

    if (!widget) continue

    if (isList) {
      let list = factory.blankNode()
      quads.push(factory.quad(subject, predicate, list))
      for (const [index, value] of values.entries()) {
        const first = factory.blankNode()
        quads.push(factory.quad(list, rdf('first'), first))
        quads.push(...nodeShape(property.out(sh('node')), context, value, widgets, first, activeContentLanguage))
        const rest = factory.blankNode()
        if (index === values.length - 1) {
          quads.push(factory.quad(list, rdf('rest'), rdf('nil')))
        } else {
          quads.push(factory.quad(list, rdf('rest'), rest))
        }
        list = rest
      }
    } else {
      for (const value of values) {
        if (!mustRenderNode && !isList) {
          const term = widget.meta.createTerm!({ activeContentLanguage })
          if (term.termType === 'Literal') term.datatype = datatype
          term.value = term.termType === 'Literal' && datatype ? cast(value, datatype) : value
          quads.push(factory.quad(subject, predicate, term as Quad_Object))
        } else if (mustRenderNode && !isList) {
          const blankNode = factory.blankNode()
          const innerQuads = [
            ...nodeShape(property.out(sh('node')), context, value, widgets, blankNode, activeContentLanguage),
            factory.quad(subject, predicate, blankNode)
          ]
          quads.push(...innerQuads)
        }
      }
    }
  }
  return quads
}
