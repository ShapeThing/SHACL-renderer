import ShaclRenderer, { ShaclRendererProps } from '../ShaclRenderer'

export default {
  title: 'SHACL Renderer/Multilingual',
  component: ShaclRenderer,
  argTypes: {}
}

const languages = {
  en: {
    en: 'English',
    de: 'Englisch',
    nl: 'Engels'
  },
  nl: {
    nl: 'Nederlands',
    de: 'Niederländisch',
    en: 'Dutch'
  },
  de: {
    en: 'German',
    nl: 'Duits',
    de: 'Deutsch'
  }
}

export const MultilingualWithTabs = {
  args: {
    mode: 'edit',
    data: new URL('/shapes/multilingual-data.ttl', location.origin),
    shapes: new URL('/shapes/multilingual.ttl', location.origin),
    languageMode: 'tabs',
    contentLanguages: languages
  } as ShaclRendererProps
}

export const MultilingualIndividual = {
  args: {
    mode: 'edit',
    data: new URL('/shapes/multilingual-data.ttl', location.origin),
    shapes: new URL('/shapes/multilingual.ttl', location.origin),
    languageMode: 'individual',
    contentLanguages: languages
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
