import { getWidget } from '../../core/getWidget'
import { stf, stsr } from '../../core/namespaces'
import PropertyElement from '../PropertyElement'
import { PropertyShapeInnerProps } from '../PropertyShape'

export default function PropertyShapeFacetMode({ data, property, facetSearchData }: PropertyShapeInnerProps) {
  const selectedWidgetIri = property.out(stf('facet')).term
  if (selectedWidgetIri?.equals(stsr('HideWidget'))) return null

  const Facet = getWidget('facets', property, facetSearchData)

  return Facet ? (
    <PropertyElement key={property.term.value} showColon property={property}>
      <div>
        <Facet key={property.term.value} searchData={facetSearchData} data={data} term={data.term} />
      </div>
    </PropertyElement>
  ) : null
}
