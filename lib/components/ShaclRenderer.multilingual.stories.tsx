import ShaclRenderer, { ShaclRendererProps } from './ShaclRenderer'

export default {
  title: 'SHACL Renderer/Multilingual',
  component: ShaclRenderer,
  argTypes: {}
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
