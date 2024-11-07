import ShaclRenderer, { ShaclRendererProps } from '../../../components/ShaclRenderer'

export default {
  title: 'Widgets/Editors/FileUpload',
  component: ShaclRenderer,
  argTypes: {}
}

export const Default = {
  args: {
    mode: 'edit',
    shapes: new URL('/shapes/widgets/editors/fileupload.ttl#default', location.origin),
    data: new URL('/shapes/widgets/editors/fileupload.ttl#data', location.origin)
  } as ShaclRendererProps
}
