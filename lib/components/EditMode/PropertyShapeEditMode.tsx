import { NamedNode, Term } from '@rdfjs/types'
import { JsonLdContextNormalized } from 'jsonld-context-parser'
import { property } from 'lodash-es'
import type ValidationReport from 'rdf-validate-shacl/src/validation-report'
import { useContext } from 'react'
import { languageContext } from '../../core/language-context'
import { dash, sh, stf, stsr } from '../../core/namespaces'
import { scoreWidgets } from '../../core/scoreWidgets'
import Grapoi from '../../Grapoi'
import { isOrderedList } from '../../helpers/isOrderedList'
import { TouchableTerm } from '../../helpers/touchableRdf'
import { widgetsContext } from '../../widgets/widgets-context'
import PropertyShapeEditModeNestedPredicateList from './PropertyShapeEditModeNestedPredicateList'
import PropertyShapeEditModePlain from './PropertyShapeEditModePlain'
import PropertyShapeEditModeRdfList from './PropertyShapeEditModeRdfList'

type PropertyShapeEditModeProps = {
  property: Grapoi
  data: Grapoi
  facetSearchData: Grapoi
  nodeDataPointer: Grapoi
  path: any
  errors?: ValidationReport['results']
}

export const sortBySortableState = (sortableState: any[]) => (a: Grapoi, b: Grapoi) => {
  const aTermSerialized = JSON.stringify(a.term)
  const aTerm = sortableState.find(sortableItem => sortableItem.id === aTermSerialized)
  const aIndex = aTerm ? sortableState.indexOf(aTerm) : 1000

  const bTermSerialized = JSON.stringify(b.term)
  const bTerm = sortableState.find(sortableItem => sortableItem.id === bTermSerialized)
  const bIndex = bTerm ? sortableState.indexOf(bTerm) : 1000

  return aIndex - bIndex
}

export const getErrorMessages = (errors: any[], term: Term, jsonLdContext: JsonLdContextNormalized) => {
  const itemErrors = errors?.filter((error: any) => error.value?.term.equals(term)) ?? []
  const messages = itemErrors.flatMap(error =>
    error.message
      .map((message: any) => message.value)
      .map((message: string) => {
        const IRIs = [...message.matchAll(/\<(.*)\>/g)].map(iriMatch => iriMatch[1])
        const compactedIRIs = IRIs.map(IRI => [IRI, jsonLdContext.compactIri(IRI, true)])
        for (const [expanded, compacted] of compactedIRIs) {
          message = message.replaceAll(`<${expanded}>`, `<span class="iri" title="${expanded}">${compacted}</span>`)
        }
        return message
      })
  )

  return messages
}

export const useEmptyTerm = () => {
  const { activeContentLanguage } = useContext(languageContext)
  const getWidget = useWidget()

  return (property: Grapoi, items: Grapoi) => {
    const widgetItem = getWidget(property, items)
    const emptyTerm = widgetItem?.meta.createTerm
      ? widgetItem?.meta.createTerm({ activeContentLanguage }, property)
      : null
    if (emptyTerm) (emptyTerm as TouchableTerm).touched = false
    return emptyTerm ? emptyTerm : undefined
  }
}

const cache = new Map()
export const useWidget = (predicate: NamedNode = dash('editor')) => {
  const { editors, facets, viewers } = useContext(widgetsContext)

  const widgetTypes = {
    [dash('editor').value]: editors,
    [dash('viewer').value]: viewers,
    [stf('facet').value]: facets
  }

  const widgets = widgetTypes[predicate.value]

  if (!cache.has(property)) {
    cache.set(property, new Map())
  }
  const propertyCache = cache.get(property)

  return (property: Grapoi, items: Grapoi) => {
    if (!property.hasOut(sh('or')) && propertyCache.has(items)) {
      return propertyCache.get(items)
    }

    const widget = scoreWidgets(widgets, items, property, predicate)
    propertyCache.set(items, widget)
    return propertyCache.get(items)
  }
}

export default function PropertyShapeEditMode(props: PropertyShapeEditModeProps) {
  const { path } = props

  const isRdfList = isOrderedList(path)

  if (isRdfList) return <PropertyShapeEditModeRdfList {...props} />

  const nestedOrderPredicate = props.property.out(stsr('nestedOrder')).term
  const isListWithOrderPredicate = !!nestedOrderPredicate

  if (isListWithOrderPredicate) return <PropertyShapeEditModeNestedPredicateList {...props} />

  return <PropertyShapeEditModePlain {...props} />
}
