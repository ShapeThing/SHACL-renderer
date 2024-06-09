import { getWidget } from '../../helpers/getWidget'
import PropertyElement from '../PropertyElement'
import { PropertyShapeInnerProps } from '../PropertyShape'

export default function PropertyShapeFacetMode({ data, property, facetSearchData }: PropertyShapeInnerProps) {
  const Facet = getWidget('facets', property, facetSearchData)

  return Facet ? (
    <PropertyElement key={property.term.value} showColon property={property}>
      <Facet key={property.term.value} searchData={facetSearchData} data={data} term={data.term} />
    </PropertyElement>
  ) : null
}
