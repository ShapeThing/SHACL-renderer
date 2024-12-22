import factory from '@rdfjs/data-model'
import { DatasetCore } from '@rdfjs/types'
import grapoi, { Grapoi } from 'grapoi'
import { ReactNode, useContext } from 'react'
import { mainContext } from '../core/main-context'
import { rdf, rdfs, sh } from '../core/namespaces'
import CollapsiblePropertyGroup from './CollapsiblePropertyGroup'
import PropertyGroup from './PropertyGroup'
import PropertyShape from './PropertyShape'

const propertyGroupTypes = {
  _default: PropertyGroup,
  CollapsiblePropertyGroup
}

export const getElementHelpers = ({
  shapePointer,
  facetSearchDataPointer,
  dataPointer,
  dataset
}: {
  shapePointer: Grapoi
  facetSearchDataPointer: Grapoi
  dataPointer: Grapoi
  dataset: DatasetCore
}) => {
  const mapGroup = (group: Grapoi) => {
    const groupType = group.out(rdf('type')).filter(pointer => !pointer.term.equals(sh('PropertyGroup')))
    const type = (groupType.values
      .map(value => value.split(/\/|\#/g).pop())
      .find(type => (type ? Object.keys(propertyGroupTypes).includes(type) : false)) ??
      '_default') as keyof typeof propertyGroupTypes
    const Element = propertyGroupTypes[type]

    return [
      parseInt(group.out(sh('order')).value as string) ?? 0,
      <Element
        key={group.term.value}
        shapePointer={shapePointer}
        facetSearchDataPointer={facetSearchDataPointer}
        nodeDataPointer={dataPointer}
        group={group}
      />
    ] as [number, ReactNode]
  }

  const mapProperty = (property: Grapoi) =>
    [
      parseFloat(property.out(sh('order')).value as string) ?? 0,
      <PropertyShape
        dataset={dataset}
        key={property.term.value}
        facetSearchDataPointer={facetSearchDataPointer}
        nodeDataPointer={dataPointer}
        property={property}
      />
    ] as [number, ReactNode]

  return { mapGroup, mapProperty }
}

export default function NodeShape() {
  const { shapePointer, mode, dataPointer, facetSearchDataPointer, data: dataset } = useContext(mainContext)
  const isClosed = shapePointer.out(sh('closed')).value === 'true'

  const properties: Grapoi = shapePointer.out(sh('property'))
  const groups = [...shapePointer.node().hasOut(rdf('type'), sh('PropertyGroup'))]

  const topLevelGroups = groups.filter(group => !group.hasOut(sh('group')).term)
  const topLevelProperties = [...properties.filter(pointer => !pointer.out(sh('group')).term)]
  const usedPredicates = properties.map((property: Grapoi) => property.out(sh('path')).term.value)
  const predicatesWithoutShapes = new Map(
    [...dataPointer.out().quads()]
      .filter(quad => !usedPredicates.includes(quad.predicate.value))
      .map(quad => [quad.predicate.value, quad.predicate])
  )
  const propertiesWithoutShapes: Grapoi[] = !isClosed
    ? [...predicatesWithoutShapes.values()].map(predicate => {
        const propertyIri = factory.namedNode(`int:${predicate.value}`)

        const quads = [
          factory.quad(factory.namedNode(''), sh('property'), propertyIri),
          factory.quad(propertyIri, rdf('type'), sh('PropertyShape')),
          factory.quad(propertyIri, sh('path'), predicate)
        ]
        for (const quad of quads) dataset.add(quad)
        return grapoi({ dataset, factory, term: propertyIri })
      })
    : []

  const { mapGroup, mapProperty } = getElementHelpers({ shapePointer, dataPointer, facetSearchDataPointer, dataset })

  const formElements: ReactNode[] = [
    ...[
      ...topLevelGroups.map(mapGroup),
      ...topLevelProperties.map(mapProperty),
      ...propertiesWithoutShapes.map(mapProperty)
    ]
      .sort((a, b) => a[0] - b[0])
      .map(([_order, element]) => element)
  ]

  const description = shapePointer.out([sh('description'), rdfs('comment')]).values[0]

  return (
    <div className="node" data-term={shapePointer.values}>
      {description && ['edit'].includes(mode) ? <div>{description}</div> : null}
      {formElements}
    </div>
  )
}
