import type { Term } from '@rdfjs/types'
import type ValidationReport from 'rdf-validate-shacl/src/validation-report'
import { useContext } from 'react'
import { ReactSortable } from 'react-sortablejs'
import { mainContext } from '../../core/main-context'
import { sh } from '../../core/namespaces'
import { validationContext } from '../../core/validation/validation-context'
import Grapoi from '../../Grapoi'
import parsePath from '../../helpers/parsePath'
import { replaceList } from '../../helpers/replaceList'
import { TouchableTerm } from '../../helpers/touchableRdf'
import { useLanguageFilteredItems } from '../../hooks/useLanguageFilteredItems'
import PropertyElement from '../PropertyElement'
import { AddButtons } from './AddButtons'
import PropertyObjectEditMode from './PropertyObjectEditMode'
import { getErrorMessages, sortBySortableState, useEmptyTerm } from './PropertyShapeEditMode'
import { splitPointers } from './splitPointers'

type PropertyShapeEditModeProps = {
  property: Grapoi
  data: Grapoi
  facetSearchData: Grapoi
  nodeDataPointer: Grapoi
  path: any
  errors?: ValidationReport['results']
}

export default function PropertyShapeEditModeRdfList(props: PropertyShapeEditModeProps) {
  const addObject = (items: Grapoi, emptyTerm?: Term) => {
    if (!emptyTerm) return

    const path = parsePath(props.property.out(sh('path')))
    const firstPathPart = path?.at(0)
    if (firstPathPart?.predicates && firstPathPart?.predicates?.length > 1)
      throw new Error('Alternative property paths are not yet supported')
    const [predicate] = firstPathPart?.predicates ?? []

    const previousTerms = [...items].map((item: Grapoi) => item.term)

    if (previousTerms.some(term => term.equals(emptyTerm))) return

    const terms = [...previousTerms, emptyTerm]
    let pointer = nodeDataPointer.executeAll([path?.[0]])
    if ((previousTerms?.[0] as TouchableTerm)?.touched === false) return

    if (!pointer.isList()) {
      nodeDataPointer.addList(predicate, emptyTerm)
    } else {
      replaceList(terms, pointer)
    }

    setItems()
  }

  const { nodeDataPointer, errors, path } = props
  const { jsonLdContext } = useContext(mainContext)
  const { validate } = useContext(validationContext)
  const createEmptyTerm = useEmptyTerm()
  const [items, realSetItems] = useLanguageFilteredItems(() => {
    const items = nodeDataPointer.executeAll(path)
    if (items.ptrs.length === 0) addObject(items, createEmptyTerm(props.property, items))
    return nodeDataPointer.executeAll(path)
  })

  const sortableState = items.map((item: Grapoi) => ({ id: JSON.stringify(item.term), term: item.term }))

  const setItems = () => {
    const newItems = nodeDataPointer.executeAll(path)
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

  return (
    <PropertyElement
      cssClass={errors?.length ? 'has-error' : ''}
      property={props.property}
      suffix={<AddButtons property={props.property} items={items} addTerm={term => addObject(items, term)} />}
    >
      <div className="editors">
        <ReactSortable
          filter="input,.list-group,.form-control,.input"
          preventOnFilter={false}
          className="sortable"
          list={sortableState}
          setList={setSortableState}
        >
          {[...items].sort(sortBySortableState(sortableState)).map((item: Grapoi, index: number) => {
            const errorMessages = getErrorMessages(errors ?? [], item.term, jsonLdContext)
            const property = splitPointers(props.property, item)

            return (
              <PropertyObjectEditMode
                {...props}
                property={property}
                key={property.values.join(':') + ':' + index}
                data={item}
                items={items}
                isList={true}
                index={index}
                alwaysShowRemove={true}
                errors={errorMessages}
                rerenderAfterManipulatingPointer={setItems}
                setTerm={(term: Term) => {
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
                  setItems()
                }}
                deleteTerm={() => {
                  const pointer = nodeDataPointer.executeAll([path[0]])
                  replaceList(
                    items.map((item: Grapoi) => item.term).filter((innerTerm: Term) => !innerTerm.equals(item.term)),
                    pointer
                  )
                  const newItems = nodeDataPointer.executeAll(path)
                  realSetItems(newItems)
                  validate()
                  setItems()
                }}
              />
            )
          })}
        </ReactSortable>
      </div>
    </PropertyElement>
  )
}
