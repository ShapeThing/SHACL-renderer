import ShaclRenderer, { ShaclRendererProps } from '../../../components/ShaclRenderer'

export default {
  title: 'Widgets/Editors/NumberField',
  component: ShaclRenderer,
  argTypes: {}
}

export const Default = {
  args: {
    mode: 'edit',
    shapes: new URL('/shapes/widgets/editors/numberfield.ttl#default', location.origin),
    data: new URL('/shapes/widgets/editors/numberfield.ttl#data', location.origin)
  } as ShaclRendererProps
}
