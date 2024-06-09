import dataFactory from '@rdfjs/data-model'
import { Term } from '@rdfjs/types'
import { useReducer } from 'react'
import { getWidget } from '../../core/getWidget'
import { stf, stsr, xsd } from '../../core/namespaces'
import PropertyElement from '../PropertyElement'
import { PropertyShapeInnerProps } from '../PropertyShape'

export default function PropertyShapeFacetMode({ data, property, facetSearchData }: PropertyShapeInnerProps) {
  const selectedWidgetIri = property.out(stf('facet')).term
  if (selectedWidgetIri?.equals(stsr('HideWidget'))) return null

  const Facet = getWidget('facets', property, facetSearchData)
  const [, forceUpdate] = useReducer(x => x + 1, 0)

  return Facet ? (
    <PropertyElement key={property.term.value} showColon property={property}>
      <div>
        <Facet
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
          term={data.term}
        />
      </div>
    </PropertyElement>
  ) : null
}
