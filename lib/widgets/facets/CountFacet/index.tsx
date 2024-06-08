import MultiRangeSlider from 'multi-range-slider-react'
import { quadsToCounts } from '../../../helpers/quadsToCounts'
import { WidgetProps } from '../../widgets-context'
import './style.scss'

export default function CountFacet({ searchData }: WidgetProps) {
  const counts = quadsToCounts(searchData.quads(), 'subject')
  const max = Math.max(...counts.values())

  return (
    <MultiRangeSlider
      min={0}
      max={max}
      canMinMaxValueSame={true}
      minValue={0}
      maxValue={max}
      step={1}
    ></MultiRangeSlider>
  )
}
