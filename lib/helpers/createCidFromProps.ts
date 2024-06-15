import { ShaclRendererProps } from '../components/ShaclRenderer'

export const createCidFromProps = ({ data, shapes, mode, subject }: ShaclRendererProps) => {
  const properties: string[] = []

  if (typeof data === 'string' || data instanceof URL) properties.push(data.toString())
  else if (typeof data === 'object') properties.push([...data]?.[0]?.subject.value ?? '')

  if (typeof shapes === 'string' || shapes instanceof URL) properties.push(shapes.toString())
  else if (typeof shapes === 'object') properties.push([...shapes]?.[0]?.subject.value ?? '')

  properties.push(mode)
  properties.push(subject?.value ?? '')

  return JSON.stringify(properties)
}
