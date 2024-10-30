import ShaclRenderer, { ShaclRendererProps } from '../../../components/ShaclRenderer'

export default {
  title: 'Widgets/Editors/Color',
  component: ShaclRenderer,
  argTypes: {}
}

export const Default = {
  args: {
    mode: 'edit',
    shapes: new URL('/shapes/widgets/editors/color.ttl#default', location.origin),
    data: new URL('/shapes/widgets/editors/color.ttl#data', location.origin)
  } as ShaclRendererProps
}
