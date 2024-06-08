import PropertyElement from '../PropertyElement'
import { PropertyShapeInnerProps } from '../PropertyShape'
import PropertyObjectEditMode from './PropertyObjectEditMode'

export default function PropertyShapeEditMode({ data, property, facetSearchData }: PropertyShapeInnerProps) {
  const items = data

  return (
    <PropertyElement property={property}>
      <div className="editors">
        {items.map(item => (
          <PropertyObjectEditMode
            facetSearchData={facetSearchData}
            key={item.term.value}
            data={item}
            property={property}
          />
        ))}
      </div>
      <button>+</button>
    </PropertyElement>
  )
}
