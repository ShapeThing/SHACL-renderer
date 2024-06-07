import { use, useState } from 'react'
import { scoreWidgets } from '../../core/scoreWidgets'
import { resolveWidgetComponent } from '../../helpers/resolveWidgetComponent'
import { widgetsContext } from '../../widgets/widgets-context'
import PropertyElement from '../PropertyElement'
import { PropertyShapeInnerProps } from '../PropertyShape'

export default function PropertyShapeFacetMode({ data, property, facetSearchData }: PropertyShapeInnerProps) {
  const { facets } = use(widgetsContext)
  const [widgetItem] = useState(() => scoreWidgets(facets, data, property))
  if (!widgetItem) return null
  const Facet = resolveWidgetComponent(widgetItem)

  return (
    <PropertyElement showColon property={property}>
      <Facet key={property.term.value} searchData={facetSearchData} term={data.term} />
    </PropertyElement>
  )
}
