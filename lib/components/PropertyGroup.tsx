import PropertyShape from './PropertyShape'

type PropertyGroupProps = {
  group: GrapoiPointer
  properties: GrapoiPointer[]
  nodeDataPointer: GrapoiPointer
  facetSearchDataPointer: GrapoiPointer
}

export default function PropertyGroup({
  group,
  nodeDataPointer,
  properties,
  facetSearchDataPointer
}: PropertyGroupProps) {
  return (
    <div className="group" data-term={group.term.value}>
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
