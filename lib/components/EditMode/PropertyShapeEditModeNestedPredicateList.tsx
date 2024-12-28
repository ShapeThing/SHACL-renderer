import factory from '@rdfjs/data-model'
import type { Term } from '@rdfjs/types'
import type { Grapoi } from 'grapoi'
import type ValidationReport from 'rdf-validate-shacl/src/validation-report'
import { useContext, useEffect } from 'react'
import { ReactSortable } from 'react-sortablejs'
import { languageContext } from '../../core/language-context'
import { mainContext } from '../../core/main-context'
import { sh, stsr, xsd } from '../../core/namespaces'
import { validationContext } from '../../core/validation/validation-context'
import { deleteTermAndDescendants } from '../../helpers/deleteTermAndDescendants'
import { useLanguageFilteredItems } from '../../hooks/useLanguageFilteredItems'
import { widgetsContext } from '../../widgets/widgets-context'
import PropertyElement from '../PropertyElement'
import { AddButtons } from './AddButtons'
import PropertyObjectEditMode from './PropertyObjectEditMode'
import { getErrorMessages } from './PropertyShapeEditMode'
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

export default function PropertyShapeEditModeNestedPredicateList(props: PropertyShapeEditModeProps) {
  const { nodeDataPointer, errors, path } = props
  const { editors } = useContext(widgetsContext)
  const { jsonLdContext } = useContext(mainContext)
  const { activeContentLanguage } = useContext(languageContext)
  const { validate } = useContext(validationContext)

  const nestedOrderPredicate = props.property.out(stsr('nestedOrder')).term

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
      newState.forEach((item: any, index: number) => {
        const pointer = nodeDataPointer.node(item.term)
        pointer.deleteOut(sh('order'))
        pointer.addOut(sh('order'), factory.literal((index + 1).toString(), xsd('decimal')))
      })
      const newItems = nodeDataPointer.executeAll(path)

      newItems.ptrs.sort((aPtr: any, bPtr: any) => {
        const a = nodeDataPointer.node(aPtr.term)
        const b = nodeDataPointer.node(bPtr.term)
        const aOrder = parseFloat(a.out(nestedOrderPredicate).value ?? '0')
        const bOrder = parseFloat(b.out(nestedOrderPredicate).value ?? '0')
        return aOrder - bOrder
      })

      realSetItems(newItems)
      validate()
    }
  }

  const addObject = useCreateAddObject(editors, props.property, items, nodeDataPointer, setItems, false)

  useEffect(() => {
    if (items.ptrs.length === 0) addObject({ activeContentLanguage })
  }, [items])

  return (
    <PropertyElement cssClass={errors?.length ? 'has-error' : ''} property={props.property}>
      <div className="editors">
        <ReactSortable
          filter="input,.list-group,.form-control"
          preventOnFilter={false}
          list={sortableState}
          setList={setSortableState}
        >
          {[...items]
            .sort((a: Grapoi, b: Grapoi) => {
              const aOrder = parseFloat(a.out(nestedOrderPredicate).value ?? '0')
              const bOrder = parseFloat(b.out(nestedOrderPredicate).value ?? '0')
              return aOrder - bOrder
            })
            .map((item: Grapoi, index: number) => {
              const errorMessages = getErrorMessages(errors ?? [], item.term, jsonLdContext)
              const property = splitPointers(props.property, item)

              return (
                <PropertyObjectEditMode
                  {...props}
                  property={property}
                  key={property.values.join(':') + ':' + index + (item.out(sh('order')).value ?? '0') + item.term.value}
                  data={item}
                  items={items}
                  isList={true}
                  index={index}
                  errors={errorMessages}
                  rerenderAfterManipulatingPointer={setItems}
                  setTerm={(_term: Term) => {
                    // When this is a nested predicate list there are no mutations.
                    return
                  }}
                  deleteTerm={() => {
                    deleteTermAndDescendants(item)
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
