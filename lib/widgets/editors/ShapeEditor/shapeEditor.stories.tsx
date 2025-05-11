import ShaclRenderer, { ShaclRendererProps } from '../../../components/ShaclRenderer'

export default {
  title: 'Widgets/Editors/Shape',
  component: ShaclRenderer,
  argTypes: {}
}

export const Default = {
  args: {
    mode: 'edit',
    shapes: new URL('/shapes/widgets/editors/shape.ttl', location.origin),
    data: new URL('/shapes/widgets/editors/shape.ttl#data', location.origin)
  } as ShaclRendererProps
}
