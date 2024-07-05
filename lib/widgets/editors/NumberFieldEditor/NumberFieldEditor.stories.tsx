import factory from '@rdfjs/data-model'
import NumberFieldEditor from '.'
import { xsd } from '../../../core/namespaces'
import { WidgetProps } from '../../widgets-context'

export default {
  title: 'Widgets/Editors/NumberFieldEditor',
  component: NumberFieldEditor,
  argTypes: {}
}

export const Widget = {
  args: {
    term: factory.literal('7', xsd('date'))
  } as WidgetProps
}
