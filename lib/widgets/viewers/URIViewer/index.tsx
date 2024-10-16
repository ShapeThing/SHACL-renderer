import { WidgetProps } from '../../widgets-context'

export default function URIViewer({ term }: WidgetProps) {
  return (
    <a href={term.value} target="_blank">
      {term.value}
    </a>
  )
}
