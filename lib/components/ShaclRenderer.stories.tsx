import ShaclRenderer, { ShaclRendererProps, schema } from './ShaclRenderer'

export default {
  title: 'SHACL Renderer',
  component: ShaclRenderer,
  argTypes: {}
}

export const View = {
  args: {
    mode: 'view',
    data: new URL('/john.ttl', location.origin),
    shapes: new URL('/shapes/contact.ttl', location.origin),
    targetClass: schema('Person')
  } as ShaclRendererProps
}

export const Form = {
  args: {
    mode: 'edit',
    data: new URL('/john.ttl', location.origin),
    shapes: new URL('/shapes/contact.ttl', location.origin),
    targetClass: schema('Person')
  } as ShaclRendererProps
}

export const InlineEdit = {
  args: {
    mode: 'inline-edit',
    data: new URL('/john.ttl', location.origin),
    shapes: new URL('/shapes/contact.ttl', location.origin),
    targetClass: schema('Person')
  } as ShaclRendererProps
}

export const Facet = {
  args: {
    mode: 'facet',
    facetSearchData: new URL('/people.ttl', location.origin),
    shapes: new URL('/shapes/contact.ttl', location.origin)
  } as ShaclRendererProps
}
