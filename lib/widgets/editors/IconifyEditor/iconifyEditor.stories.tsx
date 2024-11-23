import ShaclRenderer, { ShaclRendererProps } from '../../../components/ShaclRenderer'

export default {
  title: 'Widgets/Editors/Iconify',
  component: ShaclRenderer,
  argTypes: {}
}

export const Default = {
  args: {
    mode: 'edit',
    shapes: new URL('/shapes/widgets/editors/iconify-default.ttl#default', location.origin),
    data: new URL('/shapes/widgets/editors/iconify-default.ttl#data', location.origin)
  } as ShaclRendererProps
}

export const WithLimit = {
  args: {
    mode: 'edit',
    shapes: new URL('/shapes/widgets/editors/iconify-limit.ttl#with-limit', location.origin)
  } as ShaclRendererProps
}
