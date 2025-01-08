import Icon from '../../../components/various/Icon'
import { WidgetProps } from '../../widgets-context'

export default function IconifyViewer({ term }: WidgetProps) {
  return <Icon icon={term.value} />
}
