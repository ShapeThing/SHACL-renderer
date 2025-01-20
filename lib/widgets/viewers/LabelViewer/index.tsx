import { language } from '@rdfjs/score'
import { useContext } from 'react'
import { languageContext } from '../../../core/language-context'
import { rdfs, schema, sh, skos } from '../../../core/namespaces'
import { WidgetProps } from '../../widgets-context'

export default function LabelViewer({ term, property, nodeDataPointer }: WidgetProps) {
  const { activeInterfaceLanguage } = useContext(languageContext)

  const label =
    nodeDataPointer
      ?.node(term)
      .out([skos('prefLabel'), rdfs('label'), schema('name')])
      .best(language([activeInterfaceLanguage, '', '*']))?.value ??
    property
      ?.node(term)
      .out([skos('prefLabel'), rdfs('label'), schema('name')])
      .best(language([activeInterfaceLanguage, '', '*']))?.value

  const isEnum = !!property?.out(sh('in')).value

  return isEnum ? (
    label
  ) : (
    <a href={term.value} title={term.value} target="_blank" className="uri">
      <span className="uri-label">{label}</span>
    </a>
  )
}
