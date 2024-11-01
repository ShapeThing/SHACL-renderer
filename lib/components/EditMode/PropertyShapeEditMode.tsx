import { Icon } from '@iconify-icon/react'
import factory from '@rdfjs/data-model'
import type { Quad_Object, Term } from '@rdfjs/types'
import type { Grapoi } from 'grapoi'
import ValidationReport from 'rdf-validate-shacl/src/validation-report'
import { useContext, useEffect } from 'react'
import { languageContext } from '../../core/language-context'
import { mainContext } from '../../core/main-context'
import { dash, sh } from '../../core/namespaces'
import { scoreWidgets } from '../../core/scoreWidgets'
import { validationContext } from '../../core/validation-context'
import { deleteTermAndDescendants } from '../../helpers/deleteTermAndDescendants'
import { sortPointersStable } from '../../helpers/sortPointersStable'
import { TouchableTerm } from '../../helpers/touchableRdf'
import { useLanguageFilteredItems } from '../../helpers/useLanguageFilteredItems'
import { widgetsContext } from '../../widgets/widgets-context'
import PropertyElement from '../PropertyElement'
import PropertyObjectEditMode from './PropertyObjectEditMode'
import { useCreateAddObject } from './useCreateAddObject'

type PropertyShapeEditModeProps = {
  property: Grapoi
  data: Grapoi
  facetSearchData: Grapoi
  nodeDataPointer: Grapoi
  path: any
  errors?: ValidationReport['results']
}

export default function PropertyShapeEditMode(props: PropertyShapeEditModeProps) {
  const { property, nodeDataPointer, errors, path } = props
  const { editors } = useContext(widgetsContext)
  const { jsonLdContext, data: dataset } = useContext(mainContext)
  const { activeContentLanguage } = useContext(languageContext)
  const { validate } = useContext(validationContext)

  const [items, realSetItems] = useLanguageFilteredItems(() => nodeDataPointer.executeAll(path))

  const setItems = () => {
    const oldTerms = items.terms
    const newItems = nodeDataPointer.executeAll(path)
    sortPointersStable(newItems, oldTerms)
    realSetItems(newItems)
    validate()
  }

  const addObject = useCreateAddObject(editors, property, items, nodeDataPointer, setItems)

  useEffect(() => {
    if (items.ptrs.length === 0) addObject({ activeContentLanguage })
  }, [items])

  const maxCount = property.out(sh('maxCount')).value
    ? parseInt(property.out(sh('maxCount')).value.toString())
    : Infinity

  const emptyFallback = !items.ptrs.length ? scoreWidgets(editors, items, property, dash('editor')) : null

  return (
    <PropertyElement cssClass={errors?.length ? 'has-error' : ''} property={property}>
      <div className="editors">
        {items.map((item: Grapoi) => {
          const itemErrors = errors?.filter((error: any) => error.value?.term.equals(item.term)) ?? []
          const errorMessages = itemErrors.flatMap(error =>
            error.message
              .map((message: any) => message.value)
              .map((message: string) => {
                const IRIs = [...message.matchAll(/\<(.*)\>/g)].map(iriMatch => iriMatch[1])
                const compactedIRIs = IRIs.map(IRI => [IRI, jsonLdContext.compactIri(IRI, true)])
                for (const [expanded, compacted] of compactedIRIs) {
                  message = message.replaceAll(
                    `<${expanded}>`,
                    `<span class="iri" title="${expanded}">${compacted}</span>`
                  )
                }
                return message
              })
          )

          return (
            <PropertyObjectEditMode
              {...props}
              data={item}
              items={items}
              errors={errorMessages}
              setTerm={(term: Term) => {
                const [quad] = [...item.quads()]
                if (quad.object.equals(term)) return
                dataset.delete(quad)
                dataset.add(factory.quad(quad.subject, quad.predicate, term as Quad_Object, quad.graph))
                setItems()
              }}
              deleteTerm={() => {
                deleteTermAndDescendants(item)
                setItems()
              }}
            />
          )
        })}

        {emptyFallback && emptyFallback.meta.showIfEmpty ? (
          <emptyFallback.Component
            setTerm={(term: Term) => {
              ;(term as TouchableTerm).touched = false
              items.addOut(path[0].predicates[0], term)
              setItems()
            }}
          />
        ) : null}

        {items.ptrs.length < maxCount ? (
          <button className="button icon secondary add-object" onClick={() => addObject({ activeContentLanguage })}>
            <Icon icon="iconoir:plus" />
          </button>
        ) : null}
      </div>
    </PropertyElement>
  )
}
