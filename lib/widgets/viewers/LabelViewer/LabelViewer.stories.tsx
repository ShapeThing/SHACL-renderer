import ShaclRenderer, { ShaclRendererProps } from '../../../components/ShaclRenderer'

export default {
  title: 'Widgets/Viewers/Label',
  component: ShaclRenderer,
  argTypes: {}
}

export const Default = {
  args: {
    mode: 'view',
    shapes: new URL('/shapes/widgets/viewers/label.ttl#default', location.origin),
    data: new URL('/shapes/widgets/viewers/label.ttl#data', location.origin)
  } as ShaclRendererProps
}
