import ShaclRenderer, { ShaclRendererProps } from '../../../components/ShaclRenderer'

export default {
  title: 'Widgets/Editors/TextField',
  component: ShaclRenderer,
  argTypes: {}
}

export const Default = {
  args: {
    mode: 'edit',
    shapes: new URL('/shapes/widgets/editors/textfield.ttl#default', location.origin),
    data: new URL('/shapes/widgets/editors/textfield.ttl#data', location.origin)
  } as ShaclRendererProps
}
