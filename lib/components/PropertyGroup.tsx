import { Grapoi } from 'grapoi'
import { useContext } from 'react'
import { mainContext } from '../core/main-context'
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
  const { data: dataset } = useContext(mainContext)

  return (
    <div className={`group ${localName}`} data-term={group.term.value}>
      {properties.map(property => (
        <PropertyShape
          dataset={dataset}
          facetSearchDataPointer={facetSearchDataPointer}
          nodeDataPointer={nodeDataPointer}
          property={property}
        />
      ))}
    </div>
  )
}
