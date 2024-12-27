import { Icon } from '@iconify-icon/react'
import factory from '@rdfjs/data-model'
import type { Quad_Object, Term } from '@rdfjs/types'
import type { Grapoi } from 'grapoi'
import type ValidationReport from 'rdf-validate-shacl/src/validation-report'
import { useContext, useEffect } from 'react'
import { ReactSortable } from 'react-sortablejs'
import { languageContext } from '../../core/language-context'
import { mainContext } from '../../core/main-context'
import { dash, sh, stsr, xsd } from '../../core/namespaces'
import { scoreWidgets } from '../../core/scoreWidgets'
import { validationContext } from '../../core/validation/validation-context'
import { allLogicalPointers } from '../../helpers/allLogicalPointers'
import { deleteTermAndDescendants } from '../../helpers/deleteTermAndDescendants'
import { isOrderedList } from '../../helpers/isOrderedList'
import { replaceList } from '../../helpers/replaceList'
import { sortPointersStable } from '../../helpers/sortPointersStable'
import { TouchableTerm } from '../../helpers/touchableRdf'
import { useLanguageFilteredItems } from '../../hooks/useLanguageFilteredItems'
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
  const { nodeDataPointer, errors, path } = props
  const { editors } = useContext(widgetsContext)
  const { jsonLdContext, data: dataset } = useContext(mainContext)
  const { activeContentLanguage } = useContext(languageContext)
  const { validate } = useContext(validationContext)

  const isRdfList = isOrderedList(path)

  const nestedOrderPredicate = props.property.out(stsr('nestedOrder')).term
  const isListWithOrderPredicate = !!nestedOrderPredicate
  const isList = isRdfList || isListWithOrderPredicate

  const [items, realSetItems] = useLanguageFilteredItems(() => nodeDataPointer.executeAll(path))
  const defaultWidget = scoreWidgets(editors, items, props.property, dash('editor'))
  const sortableState = items.map((item: Grapoi) => ({ id: JSON.stringify(item.term), term: item.term }))

  const uniqueLang = props.property.out(sh('uniqueLang')).term?.value === 'true'

  const setItems = () => {
    const oldTerms = items.map((i: Grapoi) => i.term)
    const newItems = nodeDataPointer.executeAll(path)
    if (!isRdfList && !isListWithOrderPredicate) sortPointersStable(newItems, oldTerms)
    realSetItems(newItems)
    validate()
  }

  const setSortableState = (newState: any, _context: any) => {
    const oldStateSerialized = items.map((item: Grapoi) => JSON.stringify(item.term)).join('')
    const newStateSerialized = newState.map((item: any) => JSON.stringify(item.term)).join('')

    if (oldStateSerialized !== newStateSerialized) {
      if (isListWithOrderPredicate) {
        newState.forEach((item: any, index: number) => {
          const pointer = nodeDataPointer.node(item.term)
          pointer.deleteOut(sh('order'))
          pointer.addOut(sh('order'), factory.literal((index + 1).toString(), xsd('decimal')))
        })
      } else {
        const pointer = nodeDataPointer.executeAll([path[0]])
        replaceList(
          newState.map((item: Grapoi) => item.term),
          pointer
        )
      }
      const newItems = nodeDataPointer.executeAll(path)

      if (isListWithOrderPredicate) {
        newItems.ptrs.sort((aPtr: any, bPtr: any) => {
          const a = nodeDataPointer.node(aPtr.term)
          const b = nodeDataPointer.node(bPtr.term)
          const aOrder = parseFloat(a.out(nestedOrderPredicate).value ?? '0')
          const bOrder = parseFloat(b.out(nestedOrderPredicate).value ?? '0')
          return aOrder - bOrder
        })
      }

      realSetItems(newItems)
      validate()
    }
  }

  const addObject = useCreateAddObject(editors, props.property, items, nodeDataPointer, setItems, isRdfList)

  useEffect(() => {
    if (items.ptrs.length === 0) addObject({ activeContentLanguage })
  }, [items])

  const maxCount = props.property.out(sh('maxCount')).value
    ? parseInt(props.property.out(sh('maxCount')).value.toString())
    : Infinity

  const emptyFallback = !items.ptrs.length ? defaultWidget : null

  const sortedItems = [...items].sort((a: Grapoi, b: Grapoi) => {
    if (isListWithOrderPredicate) {
      const aOrder = parseFloat(a.out(nestedOrderPredicate).value ?? '0')
      const bOrder = parseFloat(b.out(nestedOrderPredicate).value ?? '0')
      return aOrder - bOrder
    }

    const aTermSerialized = JSON.stringify(a.term)
    const aTerm = sortableState.find(sortableItem => sortableItem.id === aTermSerialized)
    const aIndex = aTerm ? sortableState.indexOf(aTerm) : 1000

    const bTermSerialized = JSON.stringify(b.term)
    const bTerm = sortableState.find(sortableItem => sortableItem.id === bTermSerialized)
    const bIndex = bTerm ? sortableState.indexOf(bTerm) : 1000

    return aIndex - bIndex
  })

  const childItems = sortedItems.map((item: Grapoi, index: number) => {
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

    let property = props.property.clone({})
    const allPointers = allLogicalPointers(property)

    // sh:or support specifically for the current item.
    if (allPointers.length > 1) {
      const filteredPointers = allPointers.filter(pointer => {
        // TODO add other checks to invalidate certain property shapes.
        const nodeKind = pointer.out(sh('nodeKind')).term
        if (nodeKind?.equals(sh('IRI')) && item?.term?.termType !== 'NamedNode') return false
        if (nodeKind?.equals(sh('Literal')) && item?.term?.termType !== 'Literal') return false

        return true
      })

      if (filteredPointers.length === 1) {
        property = filteredPointers[0]
      } else {
        throw new Error('Not yet supported')
      }
    }

    return (
      <PropertyObjectEditMode
        {...props}
        property={property}
        key={
          isListWithOrderPredicate
            ? property.values.join(':') + ':' + index + (item.out(sh('order')).value ?? '0') + item.term.value
            : property.values.join(':') + ':' + index
        }
        data={item}
        items={items}
        isList={isList}
        index={index}
        errors={errorMessages}
        rerenderAfterManipulatingPointer={setItems}
        setTerm={(term: Term) => {
          // When this is a nested predicate list there are no mutations.
          if (isListWithOrderPredicate) return

          if (isRdfList) {
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
          if (isRdfList) {
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
    <PropertyElement cssClass={errors?.length ? 'has-error' : ''} property={props.property}>
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

        {items.ptrs.length < maxCount && !uniqueLang ? (
          <button className="button icon secondary add-object" onClick={() => addObject({ activeContentLanguage })}>
            <Icon icon="iconoir:plus" />
          </button>
        ) : null}
      </div>
    </PropertyElement>
  )
}
