import ShaclRenderer, { ShaclRendererProps, schema } from './ShaclRenderer'

export default {
  title: 'SHACL Renderer/Inline',
  component: ShaclRenderer,
  argTypes: {}
}

export const InlineEdit = {
  args: {
    mode: 'inline-edit',
    data: new URL('/john.ttl', location.origin),
    shapes: new URL('/shapes/contact-closed.ttl', location.origin),
    targetClass: schema('Person')
  } as ShaclRendererProps
}
