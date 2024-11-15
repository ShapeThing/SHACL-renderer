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

  const propertiesAsElements = properties.map(property => (
    <PropertyShape
      key={property.term.value}
      dataset={dataset}
      facetSearchDataPointer={facetSearchDataPointer}
      nodeDataPointer={nodeDataPointer}
      property={property}
    />
  ))

  return (
    <div className={`group ${localName}`} data-term={group.term.value}>
      {propertiesAsElements}
    </div>
  )
}
