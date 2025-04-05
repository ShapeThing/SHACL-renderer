import { language } from '@rdfjs/score'
import { DatasetCore } from '@rdfjs/types'
import { Grapoi } from 'grapoi'
import { ReactNode, useContext } from 'react'
import { languageContext } from '../../core/language-context'
import { mainContext } from '../../core/main-context'
import { rdf, rdfs, sh, stsr } from '../../core/namespaces'
import { nonNullable } from '../../helpers/nonNullable'
import parsePath from '../../helpers/parsePath'
import { getElementHelpers } from '../NodeShape'

export type PropertyGroupProps = {
  group: Grapoi
  nodeDataPointer: Grapoi
  facetSearchDataPointer: Grapoi
  shapePointer: Grapoi
  className?: string
}

export const groupHasContents = (group: Grapoi, shapePointer: Grapoi, dataPointer: Grapoi, onlyWhenData: boolean) => {
  const groups = [...shapePointer.node().hasOut(rdf('type'), sh('PropertyGroup'))]
  const groupLevelGroups = groups.filter(innerGroup => innerGroup.out(sh('group')).term?.equals(group.term))
  const groupLevelProperties: Grapoi = shapePointer.out(sh('property')).hasOut(sh('group'), group.term)
  const someNestedGroupHasContents = groupLevelGroups.some(group =>
    groupHasContents(group, shapePointer, dataPointer, onlyWhenData)
  )

  const hasData = [...groupLevelProperties].some((property: Grapoi) => {
    const path = parsePath(property.out(sh('path')))
    const innerData = dataPointer.executeAll(path)
    return !!innerData.terms.length
  })

  return (onlyWhenData ? hasData : groupLevelProperties.ptrs.length) || someNestedGroupHasContents
}

export const getProperties = ({
  shapePointer,
  group,
  dataset,
  facetSearchDataPointer,
  nodeDataPointer,
  groupByUsage,
  mode
}: {
  shapePointer: Grapoi
  group: Grapoi
  dataset: DatasetCore
  facetSearchDataPointer: Grapoi
  nodeDataPointer: Grapoi
  groupByUsage?: boolean
  mode: string
}) => {
  const groups = [...shapePointer.node().hasOut(rdf('type'), sh('PropertyGroup'))]
  const groupLevelGroups = groups.filter(innerGroup => innerGroup.out(sh('group')).term?.equals(group.term))
  const groupLevelProperties: Grapoi = shapePointer.out(sh('property')).hasOut(sh('group'), group.term)

  const { mapGroup, mapProperty } = getElementHelpers({
    shapePointer,
    dataPointer: nodeDataPointer,
    facetSearchDataPointer,
    dataset,
    mode
  })

  const formElements: [number, ReactNode, boolean, Grapoi][] = [
    ...[...groupLevelGroups.map(mapGroup), ...groupLevelProperties.map((property: Grapoi) => mapProperty(property))]
      .filter(nonNullable)
      .sort((a, b) => a[0] - b[0])
  ]

  if (groupByUsage) {
    return {
      used: formElements
        .filter(item => item[2] === true || parseInt(item[3].out(sh('minCount')).value ?? '0') > 0)
        .map(([_order, element]) => element),
      unused: formElements
        .filter(item => !item[2] && parseInt(item[3].out(sh('minCount')).value ?? '0') === 0)
        .map(([_order, _element, _used, property]) => property)
    }
  }

  return formElements.map(([_order, element]) => element)
}

export default function PropertyGroup(props: PropertyGroupProps) {
  const { activeInterfaceLanguage } = useContext(languageContext)
  const localName = props.group.term.value.split(/\/|#/g).pop()
  const { data: dataset, mode } = useContext(mainContext)
  const properties = getProperties({ ...props, dataset, mode }) as ReactNode[]
  const label = props.group.out(sh('name')).best(language([activeInterfaceLanguage, '', '*'])).value
  const description = props.group
    .out([sh('description'), rdfs('comment')])
    .best(language([activeInterfaceLanguage])).value

  return groupHasContents(props.group, props.shapePointer, props.nodeDataPointer, mode === 'view') ? (
    <div className={`group ${localName} ${props.className ?? ''}`} data-term={props.group.term.value}>
      {label ? <h3 className="title">{label}</h3> : null}
      {description ? <div className="group-description">{description}</div> : null}
      <div className="group-inner">{properties}</div>
    </div>
  ) : null
}

export const useGroupLabel = (group: Grapoi, nodeDataPointer: Grapoi) => {
  const { activeInterfaceLanguage, activeContentLanguage } = useContext(languageContext)
  const localName = group.term.value.split(/\/|#/g).pop()

  const groupLabelPath = group.out(stsr('groupLabelPath')).list()
  let label = group.out(sh('name')).best(language([activeInterfaceLanguage, '', '*'])).value ?? localName

  if (groupLabelPath) {
    /** @ts-ignore */
    const groupLabelPathPointers: Grapoi[] = [...groupLabelPath]

    const hasMultipleLanguages =
      groupLabelPathPointers.map(pointer => pointer.term.language).filter(nonNullable).length > 1

    label = groupLabelPathPointers
      .map(pointer => {
        if (pointer.term.termType === 'Literal') {
          if (hasMultipleLanguages && pointer.term.language === activeInterfaceLanguage) return pointer.term.value
          if (!hasMultipleLanguages) return pointer.term.value
          return ''
        }
        return nodeDataPointer.out(pointer.term).best(language([activeContentLanguage, '', '*'])).value
      })
      .join('')
  }

  return label
}
