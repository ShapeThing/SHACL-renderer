import { useContext } from 'react'
import { mainContext } from '../../../core/main-context'
import { WidgetProps } from '../../widgets-context'

export default function URIViewer({ term }: WidgetProps) {
  const { jsonLdContext } = useContext(mainContext)

  return (
    <a href={term.value} target="_blank">
      {jsonLdContext.compactIri(term.value)}
    </a>
  )
}
