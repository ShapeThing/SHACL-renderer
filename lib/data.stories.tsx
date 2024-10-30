import ReactJson from 'react-json-view'
import data from './data'

export default {
  title: 'SHACL Renderer/Data',
  component: ReactJson,
  argTypes: {}
}

export const withShape = {
  args: {
    src: await data(
      {
        data: new URL('/john.ttl', location.origin),
        shapes: new URL('/shapes/contact-closed.ttl', location.origin)
      },
      {
        '@vocab': 'https://schema.org/'
      }
    )
  }
}

export const withoutShape = {
  args: {
    src: await data(
      {
        data: new URL('/john.ttl', location.origin)
      },
      {
        '@vocab': 'https://schema.org/'
      }
    )
  }
}
