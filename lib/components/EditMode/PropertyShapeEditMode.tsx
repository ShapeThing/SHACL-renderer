import IconPlus from '~icons/iconoir/plus'
import PropertyElement from '../PropertyElement'
import PropertyObjectEditMode from './PropertyObjectEditMode'

type PropertyShapeEditModeProps = {
  property: GrapoiPointer
  data: GrapoiPointer
  facetSearchData: GrapoiPointer
}

export default function PropertyShapeEditMode(props: PropertyShapeEditModeProps) {
  const { data, property } = props
  const items = data

  return (
    <PropertyElement property={property}>
      <div className="editors">
        {items.map(item => (
          <div key={item.term.value}>
            <PropertyObjectEditMode {...props} data={item} />
          </div>
        ))}
      </div>
      <button>
        <IconPlus />
      </button>
    </PropertyElement>
  )
}
