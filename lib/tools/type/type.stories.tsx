import { useEffect, useState } from 'react'
import { schema, ShaclRendererProps } from '../../components/ShaclRenderer'
import { toType } from './type'

function RenderData(props: ShaclRendererProps) {
  const [type, setType] = useState<string>()
  useEffect(() => {
    toType(props).then(convertedType => setType(convertedType?.type))
  }, [])
  return (
    <code>
      <pre>{type}</pre>
    </code>
  )
}

export default {
  title: 'SHACL Renderer/TypeScript Type',
  component: RenderData,
  argTypes: {}
}

export const Type = {
  args: {
    shapes: new URL('/shapes/contact-closed.ttl', location.origin),
    targetClass: schema('Person'),
    context: { '@vocab': 'https://schema.org/' }
  }
}
