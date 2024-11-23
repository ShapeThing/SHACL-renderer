import ShaclRenderer, { ShaclRendererProps } from '../../../components/ShaclRenderer'

export default {
  title: 'Widgets/Editors/EnumSelect',
  component: ShaclRenderer,
  argTypes: {}
}

export const Default = {
  args: {
    mode: 'edit',
    shapes: new URL('/shapes/widgets/editors/enum-select.ttl#default', location.origin),
    data: new URL('/shapes/widgets/editors/enum-select.ttl#data', location.origin)
  } as ShaclRendererProps
}

export const Classes = {
  args: {
    mode: 'edit',
    shapes: new URL('/shapes/widgets/editors/enum-select-classes.ttl#default', location.origin),
    data: new URL('/shapes/widgets/editors/enum-select-classes.ttl#data', location.origin)
  } as ShaclRendererProps
}
