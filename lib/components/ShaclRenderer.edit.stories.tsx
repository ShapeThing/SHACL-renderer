import ShaclRenderer, { ShaclRendererProps, schema } from './ShaclRenderer'

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

export const MultilingualWithTabs = {
  args: {
    mode: 'edit',
    data: new URL('/shapes/multilingual.ttl#data', location.origin),
    shapes: new URL('/shapes/multilingual.ttl#default', location.origin),
    languageMode: 'tabs',
    languages: {
      en: 'English',
      nl: 'Dutch',
      de: 'German'
    }
  } as ShaclRendererProps
}

export const MultilingualIndividual = {
  args: {
    mode: 'edit',
    data: new URL('/shapes/multilingual.ttl#data', location.origin),
    shapes: new URL('/shapes/multilingual.ttl#default', location.origin),
    languageMode: 'individual',
    languages: {
      en: 'English',
      nl: 'Dutch',
      de: 'German'
    }
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
