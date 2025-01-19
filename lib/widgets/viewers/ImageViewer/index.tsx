import { useResolveMediaUrl } from '../../../hooks/useResolveMediaUrl'
import { WidgetProps } from '../../widgets-context'

export default function ImageViewer({ term }: WidgetProps) {
  const url = useResolveMediaUrl(term)
  return url ? (
    <a href={url} target="_blank">
      <img src={url} className="viewer image" />
    </a>
  ) : null
}
