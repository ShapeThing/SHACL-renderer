import ShaclRenderer, { schema, ShaclRendererProps } from './ShaclRenderer'

export default {
  title: 'SHACL Renderer/Facet',
  component: ShaclRenderer,
  argTypes: {}
}

export const Facets = {
  args: {
    mode: 'facet',
    facetSearchData: new URL('/people.ttl', location.origin),
    shapes: new URL('/shapes/contact.ttl', location.origin),
    targetClass: schema('Person')
  } as ShaclRendererProps
}
