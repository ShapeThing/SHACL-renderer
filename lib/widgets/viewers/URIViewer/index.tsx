import { useContext } from 'react'
import { mainContext } from '../../../core/main-context'
import { WidgetProps } from '../../widgets-context'

export default function URIViewer({ term }: WidgetProps) {
  const { jsonLdContext } = useContext(mainContext)

  const labelPart = jsonLdContext
    .compactIri(term.value)
    .split(/\/|\#|\:/g)
    .pop()!

  const label = labelPart.split('.')[0]

  const prefix = jsonLdContext.compactIri(term.value).replace(labelPart, '')

  console.log(term.value)

  return (
    <a href={term.value} title={term.value} target="_blank" className="uri">
      {prefix.includes('://') ? '' : <span className="uri-prefix">{prefix.substring(0, prefix.length - 1)}</span>}
      <span className="uri-label">{label}</span>
    </a>
  )
}
