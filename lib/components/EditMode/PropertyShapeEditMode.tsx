import { Icon } from '@iconify-icon/react'
import factory from '@rdfjs/data-model'
import type { Quad_Object, Term } from '@rdfjs/types'
import type { Grapoi } from 'grapoi'
import type ValidationReport from 'rdf-validate-shacl/src/validation-report'
import { useContext, useEffect } from 'react'
import { ReactSortable } from 'react-sortablejs'
import { languageContext } from '../../core/language-context'
import { mainContext } from '../../core/main-context'
import { dash, sh } from '../../core/namespaces'
import { scoreWidgets } from '../../core/scoreWidgets'
import { validationContext } from '../../core/validation-context'
import { deleteTermAndDescendants } from '../../helpers/deleteTermAndDescendants'
import { isOrderedList } from '../../helpers/isOrderedList'
import { replaceList } from '../../helpers/replaceList'
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
  const defaultWidget = scoreWidgets(editors, items, property, dash('editor'))
  const isList = isOrderedList(path)
  const sortableState = items.map((item: Grapoi) => ({ id: JSON.stringify(item.term), term: item.term }))

  const setItems = () => {
    const oldTerms = items.terms
    const newItems = nodeDataPointer.executeAll(path)
    if (!isList) sortPointersStable(newItems, oldTerms)
    realSetItems(newItems)
    validate()
  }

  const setSortableState = (newState: any, _context: any) => {
    const oldStateSerialized = items.map((item: Grapoi) => JSON.stringify(item.term)).join('')
    const newStateSerialized = newState.map((item: any) => JSON.stringify(item.term)).join('')

    if (oldStateSerialized !== newStateSerialized) {
      const pointer = nodeDataPointer.executeAll([path[0]])
      replaceList(
        newState.map((item: Grapoi) => item.term),
        pointer
      )
      const newItems = nodeDataPointer.executeAll(path)
      realSetItems(newItems)
      validate()
    }
  }

  const addObject = useCreateAddObject(editors, property, items, nodeDataPointer, setItems, isList)

  useEffect(() => {
    if (items.ptrs.length === 0) {
      addObject({ activeContentLanguage })
      document.dispatchEvent(new CustomEvent('react.render'))
    }
  }, [items])

  const maxCount = property.out(sh('maxCount')).value
    ? parseInt(property.out(sh('maxCount')).value.toString())
    : Infinity

  const emptyFallback = !items.ptrs.length ? defaultWidget : null

  const childItems = [...items]
    .sort((a: Grapoi, b: Grapoi) => {
      const aTermSerialized = JSON.stringify(a.term)
      const aTerm = sortableState.find(sortableItem => sortableItem.id === aTermSerialized)
      const aIndex = aTerm ? sortableState.indexOf(aTerm) : 1000

      const bTermSerialized = JSON.stringify(b.term)
      const bTerm = sortableState.find(sortableItem => sortableItem.id === bTermSerialized)
      const bIndex = bTerm ? sortableState.indexOf(bTerm) : 1000

      return aIndex - bIndex
    })
    .map((item: Grapoi, index: number) => {
      const itemErrors = errors?.filter((error: any) => error.value?.term.equals(item.term)) ?? []
      const errorMessages = itemErrors.flatMap(error =>
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

      return (
        <PropertyObjectEditMode
          {...props}
          key={item.term.value}
          data={item}
          items={items}
          isList={isList}
          index={index}
          errors={errorMessages}
          rerenderAfterManipulatingPointer={setItems}
          setTerm={(term: Term) => {
            if (isList) {
              const pointer = nodeDataPointer.executeAll([path[0]])
              replaceList(
                items.map((innerItem: Grapoi) => {
                  if (innerItem.term.equals(item.term)) return term
                  return innerItem.term
                }),
                pointer
              )
              const newItems = nodeDataPointer.executeAll(path)
              realSetItems(newItems)
              validate()
            } else {
              const [quad] = [...item.quads()]
              if (quad.object.equals(term)) return
              dataset.delete(quad)
              dataset.add(factory.quad(quad.subject, quad.predicate, term as Quad_Object, quad.graph))
            }
            setItems()
          }}
          deleteTerm={() => {
            if (isList) {
              const pointer = nodeDataPointer.executeAll([path[0]])
              replaceList(
                items.map((item: Grapoi) => item.term).filter((innerTerm: Term) => !innerTerm.equals(item.term)),
                pointer
              )
              const newItems = nodeDataPointer.executeAll(path)
              realSetItems(newItems)
              validate()
            } else {
              deleteTermAndDescendants(item)
            }
            setItems()
          }}
        />
      )
    })

  return (
    <PropertyElement cssClass={errors?.length ? 'has-error' : ''} property={property}>
      <div className="editors">
        {isList ? (
          <ReactSortable
            filter="input,.list-group,.form-control"
            preventOnFilter={false}
            list={sortableState}
            setList={setSortableState}
          >
            {childItems}
          </ReactSortable>
        ) : (
          childItems
        )}

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
