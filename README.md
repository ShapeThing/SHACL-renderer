![Logo](https://shacl-renderer.shapething.com/logo.svg)

# SHACL-renderer

A React Component which renders a SHACL shape as:

- a form
- a view
- facets
- a JavaScript object
- a TypeScript type

This is a work in progress...

- Supports a subset of SHACL
- Also works without a SHACL shape
- You can add your own widgets

# Usage

See more usage examples in /lib/components/stories

```tsx
import ShaclRenderer from '@shapething/shacl-renderer'

function App() {
  return (
    <ShaclRenderer
      mode="edit"
      shapes={new URL('/shapes/contact.ttl', location.origin)}
      targetClass={schema('Person')}
    />
  )
}
```
