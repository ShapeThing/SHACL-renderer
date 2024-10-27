import ShaclRenderer, { ShaclRendererProps } from '../../../components/ShaclRenderer'

export default {
  title: 'Widgets/Editors/DatePicker',
  component: ShaclRenderer,
  argTypes: {}
}

export const Default = {
  args: {
    mode: 'edit',
    shapes: new URL('/shapes/widgets/editors/datepicker.ttl#default', location.origin),
    data: new URL('/shapes/widgets/editors/datepicker.ttl#data', location.origin)
  } as ShaclRendererProps
}
