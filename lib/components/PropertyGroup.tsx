import { DatasetCore } from '@rdfjs/types'
import { Grapoi } from 'grapoi'
import { ReactNode, useContext } from 'react'
import { mainContext } from '../core/main-context'
import { rdf, sh } from '../core/namespaces'
import { getElementHelpers } from './NodeShape'

export type PropertyGroupProps = {
  group: Grapoi
  nodeDataPointer: Grapoi
  facetSearchDataPointer: Grapoi
  shapePointer: Grapoi
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
      .sort((a, b) => a[0] - b[0])
      .map(([_order, element]) => element)
  ]

  return formElements
}

export default function PropertyGroup(props: PropertyGroupProps) {
  const localName = props.group.term.value.split(/\/|#/g).pop()
  const { data: dataset } = useContext(mainContext)
  const properties = getProperties({ ...props, dataset })

  return groupHasContents(props.group, props.shapePointer) ? (
    <div className={`group ${localName}`} data-term={props.group.term.value}>
      {properties}
    </div>
  ) : null
}
