import type { Term } from '@rdfjs/types'
import type { Grapoi } from 'grapoi'
import type ValidationReport from 'rdf-validate-shacl/src/validation-report'
import { useContext, useEffect } from 'react'
import { ReactSortable } from 'react-sortablejs'
import { languageContext } from '../../core/language-context'
import { mainContext } from '../../core/main-context'
import { validationContext } from '../../core/validation/validation-context'
import { replaceList } from '../../helpers/replaceList'
import { useLanguageFilteredItems } from '../../hooks/useLanguageFilteredItems'
import { widgetsContext } from '../../widgets/widgets-context'
import PropertyElement from '../PropertyElement'
import { AddButtons } from './AddButtons'
import PropertyObjectEditMode from './PropertyObjectEditMode'
import { getErrorMessages, sortBySortableState } from './PropertyShapeEditMode'
import { splitPointers } from './splitPointers'
import { useCreateAddObject } from './useCreateAddObject'

type PropertyShapeEditModeProps = {
  property: Grapoi
  data: Grapoi
  facetSearchData: Grapoi
  nodeDataPointer: Grapoi
  path: any
  errors?: ValidationReport['results']
}

export default function PropertyShapeEditModeRdfList(props: PropertyShapeEditModeProps) {
  const { nodeDataPointer, errors, path } = props
  const { editors } = useContext(widgetsContext)
  const { jsonLdContext } = useContext(mainContext)
  const { activeContentLanguage } = useContext(languageContext)
  const { validate } = useContext(validationContext)

  const [items, realSetItems] = useLanguageFilteredItems(() => nodeDataPointer.executeAll(path))
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

  const addObject = useCreateAddObject(editors, props.property, items, nodeDataPointer, setItems, true)

  useEffect(() => {
    if (items.ptrs.length === 0) addObject({ activeContentLanguage })
  }, [items])

  return (
    <PropertyElement cssClass={errors?.length ? 'has-error' : ''} property={props.property}>
      <div className="editors">
        <ReactSortable
          filter="input,.list-group,.form-control"
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

        <AddButtons property={props.property} items={items} onAdd={addObject} />
      </div>
    </PropertyElement>
  )
}
