import { wrapWithList } from '../../helpers/wrapWithList'
import PropertyElement from '../PropertyElement'
import { PropertyShapeInnerProps } from '../PropertyShape'
import PropertyObjectInlineEditMode from './PropertyObjectInlineEditMode'

export default function PropertyShapeInlineEditMode(props: PropertyShapeInnerProps) {
  const { data, property } = props

  return (
    <PropertyElement showColon property={property}>
      {wrapWithList(
        data.map(item => (
          <PropertyObjectInlineEditMode {...props} key={property.term?.value + item.term?.value} data={item} />
        )),
        property
      )}
    </PropertyElement>
  )
}
