import { Fragment } from 'react/jsx-runtime'
import ShaclRenderer, { schema } from '../lib'

const options = {
  viewer: {
    label: 'A SHACL viewer',
    component: (
      <ShaclRenderer
        key={'viewer'}
        mode="view"
        data={new URL('/john.ttl', location.origin)}
        shapes={new URL('/shapes/contact.ttl', location.origin)}
        targetClass={schema('Person')}
      />
    )
  },
  editor: {
    label: 'A SHACL editor',
    component: (
      <ShaclRenderer
        mode="edit"
        key={'editor'}
        data={new URL('/john.ttl', location.origin)}
        shapes={new URL('/shapes/contact.ttl', location.origin)}
        targetClass={schema('Person')}
      />
    )
  },
  inlineEditor: {
    label: 'SHACL inline edit',
    component: (
      <ShaclRenderer
        mode="inline-edit"
        key={'inline-edit'}
        data={new URL('/john.ttl', location.origin)}
        shapes={new URL('/shapes/contact.ttl', location.origin)}
        targetClass={schema('Person')}
      />
    )
  },
  facets: {
    label: 'SHACL facets',
    component: (
      <ShaclRenderer
        mode="facet"
        key={'facet'}
        facetSearchData={new URL('/people.ttl', location.origin)}
        shapes={new URL('/shapes/contact.ttl', location.origin)}
        targetClass={schema('Person')}
      />
    )
  }
}

export default function Demo() {
  return (
    <>
      {Object.values(options).map(({ label, component }) => (
        <Fragment key={label}>
          <h3>{label}</h3>
          {component}
        </Fragment>
      ))}
    </>
  )
}
