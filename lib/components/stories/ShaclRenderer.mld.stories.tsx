import ShaclRenderer, { ShaclRendererProps } from '../ShaclRenderer'

export default {
  title: 'SHACL Renderer/M-ld',
  component: ShaclRenderer,
  argTypes: {}
}

// const { dataset, prefixes } = await resolveRdfInput(new URL('/john.ttl#john', location.origin))

export const Genesis = {
  args: {
    mode: 'edit',
    mld: {
      genesis: true,
      id: localStorage.mldId
    },
    shapes: new URL('/shapes/widgets/editors/datepicker.ttl#default', location.origin),
    data: new URL('/shapes/widgets/editors/datepicker.ttl#data', location.origin)
  } as ShaclRendererProps
}

export const Clone = {
  args: {
    mode: 'edit',
    mld: {
      genesis: false,
      id: localStorage.mldId
    },
    shapes: new URL('/shapes/widgets/editors/datepicker.ttl#default', location.origin),
    data: new URL('/shapes/widgets/editors/datepicker.ttl#data', location.origin)
  } as ShaclRendererProps
}
