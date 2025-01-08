import ShaclRenderer, { ShaclRendererProps } from '../../../components/ShaclRenderer'

export default {
  title: 'Widgets/Viewers/Iconify',
  component: ShaclRenderer,
  argTypes: {}
}

export const Default = {
  args: {
    mode: 'view',
    shapes: new URL('/shapes/widgets/editors/iconify.ttl#default', location.origin),
    data: new URL('/shapes/widgets/editors/iconify.ttl#data', location.origin)
  } as ShaclRendererProps
}
