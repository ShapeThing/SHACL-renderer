import factory from '@rdfjs/data-model'
import TextFieldEditor from '.'
import { WidgetProps } from '../../widgets-context'

export default {
  title: 'Widgets/Editors/TextFieldEditor',
  component: TextFieldEditor,
  argTypes: {}
}

export const Widget = {
  args: {
    term: factory.literal('Lorem Ipsum')
  } as WidgetProps
}
