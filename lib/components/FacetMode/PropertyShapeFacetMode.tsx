import { useContext } from 'react'
import { stf } from '../../core/namespaces'
import { scoreWidgets } from '../../core/scoreWidgets'
import { setConstraint } from '../../helpers/setConstraint'
import { widgetsContext } from '../../widgets/widgets-context'
import PropertyElement from '../PropertyElement'
import { PropertyShapeInnerProps } from '../PropertyShape'

export default function PropertyShapeFacetMode(props: PropertyShapeInnerProps) {
  const { data, property, facetSearchData } = props
  const { facets } = useContext(widgetsContext)
  const widgetItem = scoreWidgets(facets, facetSearchData, property, stf('facet'))

  return widgetItem ? (
    <PropertyElement key={property.term.value} showColon property={property}>
      <div className="facet">
        <widgetItem.Component
          key={property.term.value}
          {...props}
          setConstraint={setConstraint(data)}
          term={property.term}
        />
      </div>
    </PropertyElement>
  ) : null
}
