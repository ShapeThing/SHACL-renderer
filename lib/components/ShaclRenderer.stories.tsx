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
    shapes: new URL('/shapes/contact-closed.ttl', location.origin),
    targetClass: schema('Person')
  } as ShaclRendererProps
}

export const ViewWithoutShape = {
  args: {
    mode: 'view',
    data: new URL('/john.ttl', location.origin),
    targetClass: schema('Person')
  } as ShaclRendererProps
}
export const FormEdit = {
  args: {
    mode: 'edit',
    data: new URL('/john.ttl', location.origin),
    shapes: new URL('/shapes/contact-closed.ttl', location.origin),
    targetClass: schema('Person')
  } as ShaclRendererProps
}

export const FormCreate = {
  args: {
    mode: 'edit',
    shapes: new URL('/shapes/contact.ttl', location.origin),
    targetClass: schema('Person')
  } as ShaclRendererProps
}

export const FormWithoutShape = {
  args: {
    mode: 'edit',
    data: new URL('/john.ttl', location.origin),
    targetClass: schema('Person')
  } as ShaclRendererProps
}

// export const FormShacl = {
//   args: {
//     mode: 'edit',
//     data: new URL('/shapes/contact.ttl', location.origin),
//     shapes: new URL('https://www.w3.org/ns/shacl-shacl'),
//     shapeSubject: new URL('http://www.w3.org/ns/shacl-shacl#ShapeShape')
//   } as ShaclRendererProps
// }

export const FormInvalid = {
  args: {
    mode: 'edit',
    data: new URL('/john-invalid.ttl', location.origin),
    shapes: new URL('/shapes/contact.ttl', location.origin),
    targetClass: schema('Person')
  } as ShaclRendererProps
}

export const InlineEdit = {
  args: {
    mode: 'inline-edit',
    data: new URL('/john.ttl', location.origin),
    shapes: new URL('/shapes/contact-closed.ttl', location.origin),
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
