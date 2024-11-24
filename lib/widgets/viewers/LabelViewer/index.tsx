import { rdfs, schema, sh } from '../../../core/namespaces'
import { WidgetProps } from '../../widgets-context'

export default function LabelViewer({ term, property }: WidgetProps) {
  const label = property.node(term).out([sh('name'), rdfs('label'), schema('name')]).values[0]

  return (
    <a href={term.value} title={term.value} target="_blank" className="uri">
      <span className="uri-label">{label}</span>
    </a>
  )
}
