import ShaclRenderer, { ShaclRendererProps } from './ShaclRenderer'

export default {
  title: 'SHACL Renderer/View',
  component: ShaclRenderer,
  argTypes: {}
}

export const withShape = {
  args: {
    mode: 'view',
    data: new URL('/john.ttl', location.origin),
    shapes: new URL('/shapes/contact-closed.ttl', location.origin)
  } as ShaclRendererProps
}

export const withoutShape = {
  args: {
    mode: 'view',
    data: new URL('/john.ttl', location.origin)
  } as ShaclRendererProps
}
