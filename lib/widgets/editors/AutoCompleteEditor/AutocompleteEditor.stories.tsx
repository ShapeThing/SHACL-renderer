import ShaclRenderer, { ShaclRendererProps } from '../../../components/ShaclRenderer'

export default {
  title: 'Widgets/Editors/Autocomplete',
  component: ShaclRenderer,
  argTypes: {}
}

export const Default = {
  args: {
    mode: 'edit',
    shapes: new URL('/shapes/widgets/editors/autocomplete.ttl#default', location.origin),
    data: new URL('/shapes/widgets/editors/autocomplete.ttl#data', location.origin)
  } as ShaclRendererProps
}
