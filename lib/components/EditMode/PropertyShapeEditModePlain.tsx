import factory from '@rdfjs/data-model'
import type { Quad_Object, Term } from '@rdfjs/types'
import type { Grapoi } from 'grapoi'
import type ValidationReport from 'rdf-validate-shacl/src/validation-report'
import { useContext, useEffect } from 'react'
import { languageContext } from '../../core/language-context'
import { mainContext } from '../../core/main-context'
import { validationContext } from '../../core/validation/validation-context'
import { deleteTermAndDescendants } from '../../helpers/deleteTermAndDescendants'
import { sortPointersStable } from '../../helpers/sortPointersStable'
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

export default function PropertyShapeEditModePlain(props: PropertyShapeEditModeProps) {
  const { nodeDataPointer, errors, path } = props
  const { editors } = useContext(widgetsContext)
  const { jsonLdContext, data: dataset } = useContext(mainContext)
  const { activeContentLanguage } = useContext(languageContext)
  const { validate } = useContext(validationContext)

  const [items, realSetItems] = useLanguageFilteredItems(() => nodeDataPointer.executeAll(path))
  const sortableState = items.map((item: Grapoi) => ({ id: JSON.stringify(item.term), term: item.term }))

  const setItems = () => {
    const oldTerms = items.map((i: Grapoi) => i.term)
    const newItems = nodeDataPointer.executeAll(path)
    sortPointersStable(newItems, oldTerms)
    realSetItems(newItems)
    validate()
  }

  const addObject = useCreateAddObject(editors, props.property, items, nodeDataPointer, setItems)

  useEffect(() => {
    if (items.ptrs.length === 0) addObject({ activeContentLanguage })
  }, [items])

  return (
    <PropertyElement cssClass={errors?.length ? 'has-error' : ''} property={props.property}>
      <div className="editors">
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
              isList={false}
              index={index}
              errors={errorMessages}
              rerenderAfterManipulatingPointer={setItems}
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
        <AddButtons property={props.property} items={items} onAdd={addObject} />
      </div>
    </PropertyElement>
  )
}
