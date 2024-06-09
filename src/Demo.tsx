import useLocalStorage from 'react-use/esm/useLocalStorage'
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
  let [selectedDemo, setSelectedDemo] = useLocalStorage<keyof typeof options>('selectedDemo', 'viewer')

  if (!selectedDemo) selectedDemo = 'viewer'

  return (
    <>
      <select value={selectedDemo} onChange={event => setSelectedDemo(event.target.value as keyof typeof options)}>
        {Object.entries(options).map(([name, { label }]) => (
          <option key={name} value={name}>
            {label}
          </option>
        ))}
      </select>

      {options[selectedDemo].component}
    </>
  )
}
