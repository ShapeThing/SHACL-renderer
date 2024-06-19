import MultiRangeSlider from 'multi-range-slider-react'
import { sh } from '../../../core/namespaces'
import { quadsToCounts } from '../../../helpers/quadsToCounts'
import { WidgetProps } from '../../widgets-context'

export default function CountFacet({ facetSearchData, property, setConstraint }: WidgetProps) {
  const predicate = property.out(sh('path')).term
  if (!predicate) return null

  const counts = quadsToCounts(facetSearchData.quads(), 'subject')
  const max = Math.max(...counts.values(), 1)

  return (
    <MultiRangeSlider
      min={0}
      max={max}
      canMinMaxValueSame={true}
      minValue={0}
      onChange={event => {
        setConstraint(sh('minCount'), event.minValue)
        setConstraint(sh('maxCount'), event.maxValue)
      }}
      maxValue={max}
      step={1}
    ></MultiRangeSlider>
  )
}
