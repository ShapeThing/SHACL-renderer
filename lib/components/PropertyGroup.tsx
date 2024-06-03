import PropertyShape from './PropertyShape'

type PropertyGroupProps = {
  group: GrapoiPointer
  properties: GrapoiPointer[]
}

export default function PropertyGroup({ group, properties }: PropertyGroupProps) {
  return (
    <div className="group" data-term={group.term.value}>
      {properties.map(property => (
        <PropertyShape key={property.term.value} property={property} />
      ))}
    </div>
  )
}
