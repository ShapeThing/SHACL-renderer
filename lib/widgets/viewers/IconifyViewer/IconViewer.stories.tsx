import ShaclRenderer, { ShaclRendererProps } from '../../../components/ShaclRenderer'

export default {
  title: 'Widgets/Viewers/Iconify',
  component: ShaclRenderer,
  argTypes: {}
}

export const Default = {
  args: {
    mode: 'view',
    shapes: new URL('/shapes/widgets/editors/iconify-default.ttl', location.origin),
    data: new URL('/shapes/widgets/editors/iconify-default.ttl#data', location.origin)
  } as ShaclRendererProps
}
