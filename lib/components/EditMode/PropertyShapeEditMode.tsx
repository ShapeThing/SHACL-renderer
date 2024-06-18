import { useContext } from 'react'
import IconPlus from '~icons/iconoir/plus'
import { sh } from '../../core/namespaces'
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

  const maxCount = property.out(sh('maxCount')).value
    ? parseInt(property.out(sh('maxCount')).value.toString())
    : Infinity

  return (
    <PropertyElement property={property}>
      <div className="editors">
        {items.map(item => (
          <div className="editor" key={item.term.value}>
            <PropertyObjectEditMode {...props} data={item} items={items} />
          </div>
        ))}
        {items.ptrs.length < maxCount ? (
          <button className="button icon secondary add-object" onClick={addObject}>
            <IconPlus />
          </button>
        ) : null}
      </div>
    </PropertyElement>
  )
}
