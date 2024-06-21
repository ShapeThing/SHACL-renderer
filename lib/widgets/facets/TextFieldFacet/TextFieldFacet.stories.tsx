import factory from '@rdfjs/data-model'
import TextFieldFacet from '.'
import { initContext } from '../../../core/main-context'
import { WidgetProps } from '../../widgets-context'

export default {
  title: 'Widgets/Facets/TextFieldFacet',
  component: TextFieldFacet,
  argTypes: {}
}

const context = await initContext({
  mode: 'facet',
  facetSearchData: new URL('/people.ttl', location.origin),
  shapes: new URL('/shapes/contact.ttl', location.origin)
})

export const Widget = {
  args: {
    term: factory.literal('Lorem Ipsum'),
    data: context.facetSearchDataPointer
  } as WidgetProps
}
