import { useEffect, useState } from 'react'
import { ShaclRendererProps } from '../../components/ShaclRenderer'
import { rdfToData } from './data'

function RenderData(props: ShaclRendererProps) {
  const [json, setJson] = useState<object>()
  useEffect(() => {
    rdfToData(props).then(setJson)
  }, [])

  return json ? (
    <pre>
      <code>{JSON.stringify(json, null, 2)}</code>
    </pre>
  ) : null
}

export default {
  title: 'SHACL Renderer/JavaScript Object',
  component: RenderData,
  argTypes: {}
}

export const withShape = {
  args: {
    data: new URL('/john.ttl', location.origin),
    shapes: new URL('/shapes/contact-closed.ttl', location.origin),
    context: { '@vocab': 'https://schema.org/' }
  }
}

export const withoutShape = {
  args: {
    data: new URL('/john.ttl', location.origin),
    context: { '@vocab': 'https://schema.org/' }
  }
}
