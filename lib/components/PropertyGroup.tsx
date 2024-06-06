import PropertyShape from './PropertyShape'

type PropertyGroupProps = {
  group: GrapoiPointer
  properties: GrapoiPointer[]
  nodeDataPointer: GrapoiPointer
}

export default function PropertyGroup({ group, nodeDataPointer, properties }: PropertyGroupProps) {
  return (
    <div className="group" data-term={group.term.value}>
      {properties.map(property => (
        <PropertyShape nodeDataPointer={nodeDataPointer} key={property.term.value} property={property} />
      ))}
    </div>
  )
}
