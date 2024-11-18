import ShaclRenderer, { ShaclRendererProps } from '../../../components/ShaclRenderer'

export default {
  title: 'Widgets/Editors/EditorJs',
  component: ShaclRenderer,
  argTypes: {}
}

export const Default = {
  args: {
    mode: 'edit',
    shapes: new URL('/shapes/widgets/editors/editor-js.ttl#default', location.origin),
    data: new URL('/shapes/widgets/editors/editor-js.ttl#data', location.origin)
  } as ShaclRendererProps
}
