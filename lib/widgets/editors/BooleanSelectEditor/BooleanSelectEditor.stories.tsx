import ShaclRenderer, { ShaclRendererProps } from '../../../components/ShaclRenderer'

export default {
  title: 'Widgets/Editors/BooleanSelect',
  component: ShaclRenderer,
  argTypes: {}
}

export const Default = {
  args: {
    mode: 'edit',
    shapes: new URL('/shapes/widgets/editors/boolean-select.ttl#default', location.origin),
    data: new URL('/shapes/widgets/editors/boolean-select.ttl#data', location.origin)
  } as ShaclRendererProps
}
