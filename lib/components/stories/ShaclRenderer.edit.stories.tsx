import ShaclRenderer, { ShaclRendererProps, schema } from '../ShaclRenderer'

export default {
  title: 'SHACL Renderer/Form',
  component: ShaclRenderer,
  argTypes: {}
}

export const CreateWithShape = {
  args: {
    mode: 'edit',
    shapes: new URL('/shapes/contact.ttl', location.origin),
    targetClass: schema('Person')
  } as ShaclRendererProps
}

export const EditWithShape = {
  args: {
    mode: 'edit',
    data: new URL('/john.ttl#john', location.origin),
    shapes: new URL('/shapes/contact-closed.ttl', location.origin),
    targetClass: schema('Person')
  } as ShaclRendererProps
}

export const SortableData = {
  args: {
    mode: 'edit',
    data: new URL('/shapes/ordered-list.ttl#data', location.origin),
    shapes: new URL('/shapes/ordered-list.ttl#shape', location.origin),
    targetClass: schema('Person')
  } as ShaclRendererProps
}

export const SortableDataEmpty = {
  args: {
    mode: 'edit',
    shapes: new URL('/shapes/ordered-list.ttl#shape', location.origin),
    targetClass: schema('Person')
  } as ShaclRendererProps
}

export const MultipleForms = {
  args: {
    mode: 'edit',
    shapes: new URL('/shapes/multiple-forms.ttl', location.origin)
  } as ShaclRendererProps
}

export const Inheritance = {
  args: {
    mode: 'edit',
    shapes: new URL('/shapes/inheritance.ttl#pet', location.origin)
  } as ShaclRendererProps
}
export const EditWithoutShape = {
  args: {
    mode: 'edit',
    data: new URL('/john.ttl#john', location.origin),
    targetClass: schema('Person')
  } as ShaclRendererProps
}

export const InvalidData = {
  args: {
    mode: 'edit',
    data: new URL('/john-invalid.ttl', location.origin),
    shapes: new URL('/shapes/contact.ttl', location.origin),
    targetClass: schema('Person')
  } as ShaclRendererProps
}

export const ShapesGraph = {
  args: {
    mode: 'edit',
    data: new URL('/john-with-shapes-graph.ttl', location.origin)
  } as ShaclRendererProps
}

export const MixedObjects = {
  args: {
    mode: 'edit',
    shapes: new URL('/shapes/mixed-objects.ttl', location.origin),
    data: new URL('/shapes/mixed-objects-data.ttl', location.origin)
  } as ShaclRendererProps
}
