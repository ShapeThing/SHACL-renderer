import { Icon } from '@iconify/react'
import PropertyElement from '../PropertyElement'
import PropertyObjectEditMode from './PropertyObjectEditMode'

type PropertyShapeEditModeProps = {
  property: GrapoiPointer
  data: GrapoiPointer
}

export default function PropertyShapeEditMode({ data, property }: PropertyShapeEditModeProps) {
  const items = data

  return (
    <PropertyElement property={property}>
      <div className="editors">
        {items.map(item => (
          <div key={item.term.value}>
            <PropertyObjectEditMode data={item} property={property} />
          </div>
        ))}
      </div>
      <button>
        {' '}
        <Icon icon="iconoir:plus" />
      </button>
    </PropertyElement>
  )
}
