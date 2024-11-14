import { useEffect, useState } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { schema, ShaclRendererProps } from './components/ShaclRenderer'
import typing from './type'

function RenderData(props: ShaclRendererProps) {
  const [type, setType] = useState<string>()
  useEffect(() => {
    typing(props).then(setType)
  }, [])
  return type ? (
    <SyntaxHighlighter language="typescript" style={docco}>
      {type}
    </SyntaxHighlighter>
  ) : null
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
