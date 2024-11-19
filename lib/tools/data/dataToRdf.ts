import factory from '@rdfjs/data-model'
import { DatasetCore } from '@rdfjs/types'
import { Grapoi } from 'grapoi'
import { JsonLdContextNormalized } from 'jsonld-context-parser'
import { Quad_Object } from 'n3'
import { initContext, MainContext } from '../../core/main-context'
import { dash, prefixes, sh } from '../../core/namespaces'
import { scoreWidgets } from '../../core/scoreWidgets'
import { nonNullable } from '../../helpers/nonNullable'
import parsePath from '../../helpers/parsePath'
import { coreWidgets } from '../../widgets/coreWidgets'

const nodeShape = (
  mainContext: MainContext,
  shapePointer: Grapoi,
  context: JsonLdContextNormalized,
  widgets: typeof coreWidgets,
  data: any
) => {
  return [...shapePointer.out(sh('property'))]
    .map((property: Grapoi) => propertyShape(mainContext, property, context, widgets, data))
    .filter(nonNullable)
    .flat()
}

const propertyShape = (
  mainContext: MainContext,
  propertyPointer: Grapoi,
  context: JsonLdContextNormalized,
  widgets: typeof coreWidgets,
  data: any
) => {
  const path = parsePath(propertyPointer.out(sh('path')))

  // For now we can only deal with simple paths.
  if (path?.[0]?.predicates.length !== 1) return

  const predicate = path[0].predicates[0]
  const compactedPredicate = context.compactIri(predicate.value, true)

  if (!data[compactedPredicate]) return

  const values = Array.isArray(data[compactedPredicate]) ? data[compactedPredicate] : [data[compactedPredicate]]

  const widget = scoreWidgets(widgets['editors'], undefined, propertyPointer, dash('editor'))
  if (!widget?.meta.createTerm) return
  const activeContentLanguage = Object.keys(mainContext.languages).length ? Object.keys(mainContext.languages)[0] : 'en'

  return values.map(value => {
    const term = widget.meta.createTerm!({ activeContentLanguage })
    term.value = value
    return factory.quad(factory.namedNode(''), predicate, term as Quad_Object)
  })
}

export async function dataToRdf({
  data,
  shapes,
  shapeSubject,
  context
}: {
  data: unknown
  shapes: URL | DatasetCore | string
  shapeSubject?: URL | string
  context?: Record<string, string>
}) {
  const mainContext = await initContext({
    shapes,
    shapeSubject,
    context,
    mode: 'edit'
  })
  const { jsonLdContext, shapePointer } = mainContext
  const widgets = coreWidgets
  const mergedContext = new JsonLdContextNormalized({
    ...prefixes,
    ...jsonLdContext.getContextRaw(),
    ...(context ?? {})
  })

  return nodeShape(mainContext, shapePointer, mergedContext, widgets, data)
}
