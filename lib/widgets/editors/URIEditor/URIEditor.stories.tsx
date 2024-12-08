import ShaclRenderer, { ShaclRendererProps } from '../../../components/ShaclRenderer'

export default {
  title: 'Widgets/Editors/URI',
  component: ShaclRenderer,
  argTypes: {}
}

export const Default = {
  args: {
    mode: 'edit',
    shapes: new URL('/shapes/widgets/editors/uri.ttl#default', location.origin),
    data: new URL('/shapes/widgets/editors/uri.ttl#data', location.origin)
  } as ShaclRendererProps
}
