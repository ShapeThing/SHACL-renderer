import factory from '@rdfjs/data-model'
import { WidgetProps } from '../../widgets-context'
import LiteralViewer from './'

export default {
  title: 'Widgets/LiteralViewer',
  component: LiteralViewer,
  argTypes: {}
}

export const Widget = {
  args: {
    term: factory.literal('Lorem Ipsum')
  } as WidgetProps
}
