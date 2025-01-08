import ShaclRenderer, { schema, ShaclRendererProps } from '../ShaclRenderer'

export default {
  title: 'SHACL Renderer/View',
  component: ShaclRenderer,
  argTypes: {}
}

export const withShape = {
  args: {
    mode: 'view',
    data: new URL('/john.ttl#john', location.origin),
    targetClass: schema('Person'),
    shapes: new URL('/shapes/contact-closed-view.ttl', location.origin)
  } as ShaclRendererProps
}

export const withoutShape = {
  args: {
    mode: 'view',
    data: new URL('/john.ttl#john', location.origin)
  } as ShaclRendererProps
}
