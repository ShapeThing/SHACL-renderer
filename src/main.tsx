import ReactDOM from 'react-dom/client'
import ShaclRenderer, { schema } from '../lib'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <h3>A SHACL viewer</h3>
    <ShaclRenderer
      mode="view"
      data={new URL('/john.ttl', location.origin)}
      shapes={new URL('/shapes/contact.ttl', location.origin)}
      targetClass={schema('Person')}
    />

    <h3>A SHACL editor</h3>
    <ShaclRenderer
      mode="edit"
      data={new URL('/john.ttl', location.origin)}
      shapes={new URL('/shapes/contact.ttl', location.origin)}
      targetClass={schema('Person')}
    />

    <h3>SHACL inline edit</h3>
    <ShaclRenderer
      mode="inline-edit"
      data={new URL('/john.ttl', location.origin)}
      shapes={new URL('/shapes/contact.ttl', location.origin)}
      targetClass={schema('Person')}
    />

    <h3>SHACL facets</h3>
    <ShaclRenderer
      mode="facet"
      facetSearchData={new URL('/people.ttl', location.origin)}
      shapes={new URL('/shapes/contact.ttl', location.origin)}
      targetClass={schema('Person')}
    />
  </>
)
