import { Term } from '@rdfjs/types'
import type { Grapoi } from 'grapoi'
import { JsonLdContextNormalized } from 'jsonld-context-parser'
import type ValidationReport from 'rdf-validate-shacl/src/validation-report'
import { stsr } from '../../core/namespaces'
import { isOrderedList } from '../../helpers/isOrderedList'
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
  return itemErrors.flatMap(error =>
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
