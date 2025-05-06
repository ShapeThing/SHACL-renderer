import { language } from '@rdfjs/score'
import { useContext } from 'react'
import { languageContext } from '../../../core/language-context'
import { mainContext } from '../../../core/main-context'
import { rdfs, schema, sh, skos, stsr } from '../../../core/namespaces'
import Grapoi from '../../../Grapoi'
import { WidgetProps } from '../../widgets-context'

export default function LabelViewer({ term, property, nodeDataPointer }: WidgetProps) {
  const { activeInterfaceLanguage } = useContext(languageContext)
  const { externalStorePointer } = useContext(mainContext)

  const getLabel = (pointer: Grapoi) =>
    pointer
      ?.node(term)
      .out([skos('prefLabel'), rdfs('label'), schema('name'), stsr('label')])
      .best(language([activeInterfaceLanguage, '', '*']))?.value

  const localName = term.value.split(/\/|\#/g).pop()!
  const label = getLabel(nodeDataPointer) ?? getLabel(property) ?? getLabel(externalStorePointer) ?? localName
  const isEnum = !!property?.out(sh('in')).value

  return isEnum ? (
    label ?? localName
  ) : (
    <a href={term.value} title={term.value} target="_blank" className="uri">
      <span className="uri-label">{label ?? localName}</span>
    </a>
  )
}
