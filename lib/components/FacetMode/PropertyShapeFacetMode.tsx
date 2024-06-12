import dataFactory from '@rdfjs/data-model'
import { Term } from '@rdfjs/types'
import { use, useReducer } from 'react'
import { stf, stsr, xsd } from '../../core/namespaces'
import { scoreWidgets } from '../../core/scoreWidgets'
import { widgetsContext } from '../../widgets/widgets-context'
import PropertyElement from '../PropertyElement'
import { PropertyShapeInnerProps } from '../PropertyShape'

export default function PropertyShapeFacetMode({ data, property, facetSearchData }: PropertyShapeInnerProps) {
  const selectedWidgetIri = property.out(stf('facet')).term
  if (selectedWidgetIri?.equals(stsr('HideWidget'))) return null
  const { facets } = use(widgetsContext)

  const widgetItem = scoreWidgets(facets, facetSearchData, property, stf('facet'))

  const [, forceUpdate] = useReducer(x => x + 1, 0)

  return widgetItem ? (
    <PropertyElement key={property.term.value} showColon property={property}>
      <div>
        <widgetItem.Component
          key={property.term.value}
          setConstraint={(predicate: Term, value: string | number | Term) => {
            const valueTerm =
              typeof value === 'string'
                ? dataFactory.literal(value)
                : typeof value === 'number'
                ? dataFactory.literal(value.toString(), xsd('decimal'))
                : value
            data.deleteOut(predicate).addOut(predicate, valueTerm)
            forceUpdate()
          }}
          searchData={facetSearchData}
          data={data}
          property={property}
          term={property.term}
        />
      </div>
    </PropertyElement>
  ) : null
}
