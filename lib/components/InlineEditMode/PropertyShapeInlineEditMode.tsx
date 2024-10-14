import { useContext, useState } from 'react'
import IconPlus from '~icons/iconoir/plus'
import { sh } from '../../core/namespaces'
import { wrapWithList } from '../../helpers/wrapWithList'
import { widgetsContext } from '../../widgets/widgets-context'
import { createAddObject } from '../EditMode/createAddObject'
import PropertyElement from '../PropertyElement'
import { PropertyShapeInnerProps } from '../PropertyShape'
import PropertyObjectInlineEditMode from './PropertyObjectInlineEditMode'

export default function PropertyShapeInlineEditMode(props: PropertyShapeInnerProps) {
  const { data, property, nodeDataPointer, path } = props
  const { editors } = useContext(widgetsContext)
  const [items, setItems] = useState(() => nodeDataPointer.executeAll(path))

  const addObject = createAddObject(editors, property, data, nodeDataPointer, setItems)

  const maxCount = property.out(sh('maxCount')).value
    ? parseInt(property.out(sh('maxCount')).value.toString())
    : Infinity

  return (
    <PropertyElement showColon property={property}>
      {wrapWithList(
        items.map((item: any) => (
          <PropertyObjectInlineEditMode
            {...props}
            initialMode={item.term?.value === '' ? 'edit' : 'view'}
            key={property.term?.value + item.term?.value}
            data={item}
            items={items}
          />
        )),
        property
      )}

      {items.ptrs.length < maxCount ? (
        <button onClick={() => addObject()}>
          <IconPlus />
        </button>
      ) : null}
    </PropertyElement>
  )
}
