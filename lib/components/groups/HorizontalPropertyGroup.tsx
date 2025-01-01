import PropertyGroup, { PropertyGroupProps } from './PropertyGroup'

export default function HorizontalPropertyGroup(props: PropertyGroupProps) {
  return <PropertyGroup {...props} className={`horizontal ${props.className ?? ''}`} />
}
