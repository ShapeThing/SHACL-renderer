import { useEffect, useState } from 'react'
import ReactJson from 'react-json-view'
import { ShaclRendererProps } from './components/ShaclRenderer'
import data from './data'

function RenderData(props: ShaclRendererProps) {
  const [json, setJson] = useState()

  useEffect(() => {
    data(props).then(setJson)
  }, [])

  return json ? <ReactJson src={json} /> : null
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
