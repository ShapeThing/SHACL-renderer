import ShaclRenderer, { ShaclRendererProps } from '../../../components/ShaclRenderer'

export default {
  title: 'Widgets/Viewers/Image',
  component: ShaclRenderer,
  argTypes: {}
}

export const Default = {
  args: {
    mode: 'view',
    shapes: new URL('/shapes/widgets/viewers/image.ttl#default', location.origin),
    data: new URL('/shapes/widgets/viewers/image.ttl#data', location.origin)
  } as ShaclRendererProps
}
