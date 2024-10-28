import { useContext } from 'react'
import parsePath from 'shacl-engine/lib/parsePath'
import { mainContext } from '../../core/main-context'
import { sh, stf } from '../../core/namespaces'
import { scoreWidgets } from '../../core/scoreWidgets'
import { setConstraint } from '../../helpers/setConstraint'
import { widgetsContext } from '../../widgets/widgets-context'
import PropertyElement from '../PropertyElement'
import { PropertyShapeInnerProps } from '../PropertyShape'

export default function PropertyShapeFacetMode(props: PropertyShapeInnerProps) {
  const { facetSearchDataPointer } = useContext(mainContext)
  const { nodeDataPointer, property } = props
  const path = parsePath(property.out(sh('path')))
  const facetSearchData = facetSearchDataPointer.executeAll(path)
  const { facets } = useContext(widgetsContext)
  const widgetItem = scoreWidgets(facets, facetSearchData, property, stf('facet'))
  const predicate = property.out(sh('path')).term
  const data = nodeDataPointer.out(sh('property')).distinct().hasOut(sh('path'), predicate)

  return widgetItem ? (
    <PropertyElement showColon property={property}>
      <div className="facet">
        <widgetItem.Component
          {...props}
          facetSearchData={facetSearchData}
          data={data}
          setConstraint={setConstraint(data)}
          term={property.term}
        />
      </div>
    </PropertyElement>
  ) : null
}
