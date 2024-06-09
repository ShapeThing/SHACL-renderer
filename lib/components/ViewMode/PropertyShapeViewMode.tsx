import { getWidget } from '../../core/getWidget'
import { wrapWithList } from '../../helpers/wrapWithList'
import PropertyElement from '../PropertyElement'
import { PropertyShapeInnerProps } from '../PropertyShape'

export default function PropertyShapeViewMode({ data, property }: PropertyShapeInnerProps) {
  return (
    <PropertyElement showColon property={property}>
      {wrapWithList(
        data.map(item => {
          const Viewer = getWidget('viewers', property, item)
          return Viewer ? <Viewer key={item.term.value} term={item.term} property={property} data={item} /> : null
        }),
        property
      )}
    </PropertyElement>
  )
}
