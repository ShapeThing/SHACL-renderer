import { useContext } from 'react'
import IconPlus from '~icons/iconoir/plus'
import { widgetsContext } from '../../widgets/widgets-context'
import PropertyElement from '../PropertyElement'
import PropertyObjectEditMode from './PropertyObjectEditMode'
import { createAddObject } from './createAddObject'

type PropertyShapeEditModeProps = {
  property: GrapoiPointer
  data: GrapoiPointer
  facetSearchData: GrapoiPointer
  nodeDataPointer: GrapoiPointer
  rerenderProperty: () => void
}

export default function PropertyShapeEditMode(props: PropertyShapeEditModeProps) {
  const { data: items, property, nodeDataPointer } = props
  const { editors } = useContext(widgetsContext)

  const addObject = createAddObject(editors, property, items, nodeDataPointer)

  return (
    <PropertyElement property={property}>
      <div className="editors">
        {items.map(item => (
          <div key={item.term.value}>
            <PropertyObjectEditMode {...props} data={item} />
          </div>
        ))}
      </div>
      <button onClick={addObject}>
        <IconPlus />
      </button>
    </PropertyElement>
  )
}
