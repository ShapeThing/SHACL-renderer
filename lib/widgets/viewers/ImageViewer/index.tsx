import Image from '../../../components/various/Image'
import { WidgetProps } from '../../widgets-context'

export default function ImageViewer({ term }: WidgetProps) {
  return (
    <a href={term.value} target="_blank">
      <Image url={term.value} className="viewer image" />
    </a>
  )
}
