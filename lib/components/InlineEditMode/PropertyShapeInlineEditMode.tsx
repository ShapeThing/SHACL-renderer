import { Icon } from '@iconify-icon/react'
import factory from '@rdfjs/data-model'
import type { Quad_Object, Term } from '@rdfjs/types'
import { useContext, useEffect, useState } from 'react'
import { languageContext } from '../../core/language-context'
import { sh } from '../../core/namespaces'
import { deleteTermAndDescendants } from '../../helpers/deleteTermAndDescendants'
import { isOrderedList } from '../../helpers/isOrderedList'
import { sortPointersStable } from '../../helpers/sortPointersStable'
import { wrapWithList } from '../../helpers/wrapWithList'
import { widgetsContext } from '../../widgets/widgets-context'
import { useCreateAddObject } from '../EditMode/useCreateAddObject'
import PropertyElement from '../PropertyElement'
import type { PropertyShapeInnerProps } from '../PropertyShape'
import PropertyObjectInlineEditMode from './PropertyObjectInlineEditMode'

export default function PropertyShapeInlineEditMode(props: PropertyShapeInnerProps) {
  const { property, nodeDataPointer, path } = props
  const { editors } = useContext(widgetsContext)

  const [items, realSetItems] = useState(() => nodeDataPointer.executeAll(path))
  const { activeContentLanguage } = useContext(languageContext)
  const isList = isOrderedList(path)

  const setItems = () => {
    const oldTerms = items.terms
    const newItems = nodeDataPointer.executeAll(path)
    sortPointersStable(newItems, oldTerms)
    realSetItems(newItems)
  }

  const addObject = useCreateAddObject(editors, property, items, nodeDataPointer, setItems)

  useEffect(() => {
    if (items.ptrs.length === 0) addObject({ activeContentLanguage })
  }, [])

  const maxCount = property.out(sh('maxCount')).value
    ? parseInt(property.out(sh('maxCount')).value.toString())
    : Infinity

  return (
    <PropertyElement showColon property={property}>
      {wrapWithList(
        items.map((item: any, index: number) => (
          <PropertyObjectInlineEditMode
            {...props}
            isList={isList}
            index={index}
            rerenderAfterManipulatingPointer={setItems}
            setTerm={(term: Term) => {
              const dataset = item.ptrs[0].dataset
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
            initialMode={item.term?.value === '' ? 'edit' : 'view'}
            key={property.term?.value + item.term?.value}
            data={item}
            items={items}
          />
        )),
        property
      )}

      {items.ptrs.length < maxCount ? (
        <button className="inline-button" onClick={() => addObject({ activeContentLanguage })}>
          <Icon icon="iconoir:plus" />
        </button>
      ) : null}
    </PropertyElement>
  )
}
