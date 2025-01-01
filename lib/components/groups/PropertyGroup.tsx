import { language } from '@rdfjs/score'
import { DatasetCore } from '@rdfjs/types'
import { Grapoi } from 'grapoi'
import { ReactNode, useContext } from 'react'
import { languageContext } from '../../core/language-context'
import { mainContext } from '../../core/main-context'
import { rdf, rdfs, sh } from '../../core/namespaces'
import { nonNullable } from '../../helpers/nonNullable'
import { getElementHelpers } from '../NodeShape'

export type PropertyGroupProps = {
  group: Grapoi
  nodeDataPointer: Grapoi
  facetSearchDataPointer: Grapoi
  shapePointer: Grapoi
  className?: string
}

export const groupHasContents = (group: Grapoi, shapePointer: Grapoi) => {
  const groups = [...shapePointer.node().hasOut(rdf('type'), sh('PropertyGroup'))]
  const groupLevelGroups = groups.filter(innerGroup => innerGroup.out(sh('group')).term?.equals(group.term))
  const groupLevelProperties: Grapoi = shapePointer.out(sh('property')).hasOut(sh('group'), group.term)
  const someNestedGroupHasContents = groupLevelGroups.some(group => groupHasContents(group, shapePointer))
  return groupLevelProperties.ptrs.length || someNestedGroupHasContents
}

export const getProperties = ({
  shapePointer,
  group,
  dataset,
  facetSearchDataPointer,
  nodeDataPointer
}: {
  shapePointer: Grapoi
  group: Grapoi
  dataset: DatasetCore
  facetSearchDataPointer: Grapoi
  nodeDataPointer: Grapoi
}) => {
  const groups = [...shapePointer.node().hasOut(rdf('type'), sh('PropertyGroup'))]
  const groupLevelGroups = groups.filter(innerGroup => innerGroup.out(sh('group')).term?.equals(group.term))
  const groupLevelProperties: Grapoi = shapePointer.out(sh('property')).hasOut(sh('group'), group.term)

  const { mapGroup, mapProperty } = getElementHelpers({
    shapePointer,
    dataPointer: nodeDataPointer,
    facetSearchDataPointer,
    dataset
  })

  const formElements: ReactNode[] = [
    ...[...groupLevelGroups.map(mapGroup), ...groupLevelProperties.map(mapProperty)]
      .filter(nonNullable)
      .sort((a, b) => a[0] - b[0])
      .map(([_order, element]) => element)
  ]

  return formElements
}

export default function PropertyGroup(props: PropertyGroupProps) {
  const { activeInterfaceLanguage } = useContext(languageContext)
  const localName = props.group.term.value.split(/\/|#/g).pop()
  const { data: dataset } = useContext(mainContext)
  const properties = getProperties({ ...props, dataset })
  const label = props.group.out(sh('name')).best(language([activeInterfaceLanguage, '', '*'])).value
  const description = props.group
    .out([sh('description'), rdfs('comment')])
    .best(language([activeInterfaceLanguage])).value

  return groupHasContents(props.group, props.shapePointer) ? (
    <div className={`group ${localName} ${props.className ?? ''}`} data-term={props.group.term.value}>
      {label ? <h3 className="title">{label}</h3> : null}
      {description ? <div className="group-description">{description}</div> : null}
      <div className="group-inner">{properties}</div>
    </div>
  ) : null
}
