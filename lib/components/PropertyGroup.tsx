import { Grapoi } from 'grapoi'
import PropertyShape from './PropertyShape'

type PropertyGroupProps = {
  group: Grapoi
  properties: Grapoi[]
  nodeDataPointer: Grapoi
  facetSearchDataPointer: Grapoi
}

export default function PropertyGroup({
  group,
  nodeDataPointer,
  properties,
  facetSearchDataPointer
}: PropertyGroupProps) {
  const localName = group.term.value.split(/\/|#/g).pop()

  return (
    <div className={`group ${localName}`} data-term={group.term.value}>
      {properties.map(property => (
        <PropertyShape
          facetSearchDataPointer={facetSearchDataPointer}
          nodeDataPointer={nodeDataPointer}
          property={property}
        />
      ))}
    </div>
  )
}
