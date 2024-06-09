import { wrapWithList } from '../../helpers/wrapWithList'
import PropertyElement from '../PropertyElement'
import { PropertyShapeInnerProps } from '../PropertyShape'
import PropertyObjectInlineEditMode from './PropertyObjectInlineEditMode'

export default function PropertyShapeInlineEditMode({ data, property }: PropertyShapeInnerProps) {
  return (
    <PropertyElement showColon property={property}>
      {wrapWithList(
        data.map(item => (
          <PropertyObjectInlineEditMode key={property.term?.value + item.term?.value} data={item} property={property} />
        )),
        property
      )}
    </PropertyElement>
  )
}
