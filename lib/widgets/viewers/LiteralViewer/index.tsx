import { WidgetProps } from '../../widgets-context'

export default function LiteralViewer({ term }: WidgetProps) {
  return <>{term.value}</>
}
