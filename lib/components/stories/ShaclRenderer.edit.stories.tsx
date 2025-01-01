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
    data: new URL('/john.ttl', location.origin),
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
    data: new URL('/john.ttl', location.origin),
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

const languageLabels = {
  en: {
    nl: 'Engels',
    en: 'English'
  },
  nl: {
    en: 'Dutch',
    nl: 'Nederlands'
  }
}

export const ShapeThingNodeShape = {
  args: {
    mode: 'edit',
    shapes: new URL('/shapes/shapething-nodeshape.ttl', location.origin),
    contentLanguages: languageLabels
  } as ShaclRendererProps
}

export const ShapeThingNodeShapeData = {
  args: {
    mode: 'edit',
    shapes: new URL('/shapes/shapething-nodeshape.ttl', location.origin),
    data: new URL('/shapes/shapething-person.ttl', location.origin),
    activeInterfaceLanguage: 'nl',
    activeContentLanguage: 'nl',
    contentLanguages: languageLabels,
    interfaceLanguages: languageLabels
  } as ShaclRendererProps
}

// export const FormShacl = {
//   args: {
//     mode: 'edit',
//     data: new URL('/shapes/contact.ttl', location.origin),
//     shapes: new URL('https://www.w3.org/ns/shacl-shacl'),
//     shapeSubject: new URL('http://www.w3.org/ns/shacl-shacl#ShapeShape')
//   } as ShaclRendererProps
// }

export const MixedObjects = {
  args: {
    mode: 'edit',
    shapes: new URL('/shapes/mixed-objects.ttl', location.origin),
    data: new URL('/shapes/mixed-objects-data.ttl', location.origin)
  } as ShaclRendererProps
}
