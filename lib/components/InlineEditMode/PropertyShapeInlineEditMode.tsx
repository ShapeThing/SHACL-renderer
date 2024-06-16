import { useContext } from 'react'
import IconPlus from '~icons/iconoir/plus'
import { wrapWithList } from '../../helpers/wrapWithList'
import { widgetsContext } from '../../widgets/widgets-context'
import { createAddObject } from '../EditMode/createAddObject'
import PropertyElement from '../PropertyElement'
import { PropertyShapeInnerProps } from '../PropertyShape'
import PropertyObjectInlineEditMode from './PropertyObjectInlineEditMode'

export default function PropertyShapeInlineEditMode(props: PropertyShapeInnerProps) {
  const { data, property, nodeDataPointer } = props
  const { editors } = useContext(widgetsContext)

  const addObject = createAddObject(editors, property, data, nodeDataPointer)

  return (
    <PropertyElement showColon property={property}>
      {wrapWithList(
        data.map(item => (
          <PropertyObjectInlineEditMode
            {...props}
            initialMode={item.term?.value === '' ? 'edit' : 'view'}
            key={property.term?.value + item.term?.value}
            data={item}
          />
        )),
        property
      )}

      <button onClick={addObject}>
        <IconPlus />
      </button>
    </PropertyElement>
  )
}
