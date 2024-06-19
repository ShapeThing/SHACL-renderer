import factory from '@rdfjs/data-model'
import TextFieldFacet from '.'
import { WidgetProps } from '../../widgets-context'

export default {
  title: 'Widgets/Facets/TextFieldFacet',
  component: TextFieldFacet,
  argTypes: {}
}

export const Widget = {
  args: {
    term: factory.literal('Lorem Ipsum')
  } as WidgetProps
}
