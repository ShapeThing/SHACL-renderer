import { Term } from '@rdfjs/types'
import PropertyElement from '../../../components/PropertyElement'
import { sh } from '../../../core/namespaces'
import { WidgetProps } from '../../widgets-context'

export default function DateFacet({ facetSearchData, setConstraint }: WidgetProps) {
  const allDates = [...facetSearchData.quads()]
    .map(quad => quad.object)
    .sort((a: Term, b: Term) => a.value.localeCompare(b.value))

  return (
    <>
      <PropertyElement label="From">
        <input
          type="date"
          onChange={event => {
            setConstraint(sh('minInclusive'), event.target.value)
          }}
          value={allDates.at(0)?.value}
          className="input"
        />
      </PropertyElement>
      <PropertyElement label="Till">
        <input
          type="date"
          onChange={event => {
            setConstraint(sh('maxInclusive'), event.target.value)
          }}
          value={allDates.at(-1)?.value}
          className="input"
        />
      </PropertyElement>
    </>
  )
}
