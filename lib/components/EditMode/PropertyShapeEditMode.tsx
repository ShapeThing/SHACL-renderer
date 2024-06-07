import PropertyElement from '../PropertyElement'
import { PropertyShapeInnerProps } from '../PropertyShape'
import PropertyObjectEditMode from './PropertyObjectEditMode'

export default function PropertyShapeEditMode({ data, property }: PropertyShapeInnerProps) {
  const items = data

  return (
    <PropertyElement property={property}>
      <div className="editors">
        {items.map(item => (
          <PropertyObjectEditMode key={item.term.value} data={item} property={property} />
        ))}
      </div>
      <button>+</button>
    </PropertyElement>
  )
}
