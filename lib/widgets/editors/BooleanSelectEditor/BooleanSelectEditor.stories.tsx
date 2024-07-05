import factory from '@rdfjs/data-model'
import BooleanSelectEditor from '.'
import { xsd } from '../../../core/namespaces'
import { WidgetProps } from '../../widgets-context'

export default {
  title: 'Widgets/Editors/BooleanSelectEditor',
  component: BooleanSelectEditor,
  argTypes: {}
}

export const WidgetOn = {
  args: {
    term: factory.literal('1', xsd('boolean'))
  } as WidgetProps
}

export const WidgetOff = {
  args: {
    term: factory.literal('0', xsd('boolean'))
  } as WidgetProps
}
