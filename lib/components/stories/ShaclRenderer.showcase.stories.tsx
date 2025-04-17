import ShaclRenderer, { ShaclRendererProps } from '../ShaclRenderer'

export default {
  title: 'SHACL Renderer/Showcase',
  component: ShaclRenderer,
  argTypes: {}
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

export const EditPersonShape = {
  args: {
    mode: 'edit',
    shapes: new URL('/shapes/shapething-nodeshape.ttl', location.origin),
    data: new URL('/shapes/shapething-person.ttl', location.origin),
    activeInterfaceLanguage: 'nl',
    useHierarchy: true,
    activeContentLanguage: 'nl',
    contentLanguages: languageLabels,
    interfaceLanguages: {
      nl: {
        nl: 'Nederlands'
      }
    }
  } as ShaclRendererProps
}

export const CreatePerson = {
  args: {
    mode: 'edit',
    shapes: new URL('/shapes/person.ttl', location.origin)
  } as ShaclRendererProps
}

export const CreateProperty = {
  args: {
    mode: 'edit',
    shapes: new URL('/shapes/property.ttl', location.origin)
  } as ShaclRendererProps
}
