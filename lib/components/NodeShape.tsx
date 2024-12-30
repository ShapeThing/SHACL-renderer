import factory from '@rdfjs/data-model'
import { DatasetCore } from '@rdfjs/types'
import grapoi, { Grapoi } from 'grapoi'
import { ReactNode, useContext } from 'react'
import { mainContext } from '../core/main-context'
import { rdf, rdfs, sh } from '../core/namespaces'
import { nonNullable } from '../helpers/nonNullable'
import CollapsiblePropertyGroup from './CollapsiblePropertyGroup'
import HorizontalPropertyGroup from './HorizontalPropertyGroup'
import PropertyGroup from './PropertyGroup'
import PropertyShape from './PropertyShape'

const propertyGroupTypes = {
  _default: PropertyGroup,
  CollapsiblePropertyGroup,
  HorizontalPropertyGroup
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
  const ignoredProperties = shapePointer.out(sh('ignoredProperties')).isList()
    ? /** @ts-ignore */
      [...shapePointer.out(sh('ignoredProperties')).list()].map(pointer => pointer.term)
    : []

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
    ignoredProperties.some(term => term.equals(property.out(sh('path')).term))
      ? null
      : ([
          parseFloat(property.out(sh('order')).value as string) ?? 0,
          <PropertyShape
            dataset={dataset}
            key={property.term.value}
            facetSearchDataPointer={facetSearchDataPointer}
            nodeDataPointer={dataPointer}
            property={property}
          />
        ] as [number, ReactNode])

  return { mapGroup, mapProperty }
}

export default function NodeShape() {
  const { shapePointer, mode, dataPointer, facetSearchDataPointer, data: dataset } = useContext(mainContext)

  const properties: Grapoi = shapePointer.out(sh('property'))
  const groups = [...shapePointer.node().hasOut(rdf('type'), sh('PropertyGroup'))]

  const topLevelGroups = groups.filter(group => !group.hasOut(sh('group')).term)
  const topLevelProperties = [...properties.filter(pointer => !pointer.out(sh('group')).term)]
  const usedPredicates = properties.map((property: Grapoi) => {
    if (property.out(sh('path')).isList()) {
      /** @ts-ignore */
      const list = [...property.out(sh('path')).list()]
      return list.map(i => i.term)[0].value
    } else {
      return property.out(sh('path')).term.value
    }
  })

  const predicatesWithoutShapes = new Map(
    [...dataPointer.out().quads()]
      .filter(quad => !usedPredicates.includes(quad.predicate.value))
      .map(quad => [quad.predicate.value, quad.predicate])
  )
  const propertiesWithoutShapes: Grapoi[] = [...predicatesWithoutShapes.values()].map(predicate => {
    const propertyIri = factory.namedNode(`int:${predicate.value}`)

    const quads = [
      factory.quad(factory.namedNode(''), sh('property'), propertyIri),
      factory.quad(propertyIri, rdf('type'), sh('PropertyShape')),
      factory.quad(propertyIri, sh('path'), predicate)
    ]
    for (const quad of quads) dataset.add(quad)
    return grapoi({ dataset, factory, term: propertyIri })
  })

  const { mapGroup, mapProperty } = getElementHelpers({ shapePointer, dataPointer, facetSearchDataPointer, dataset })

  const formElements: ReactNode[] = [
    ...[
      ...topLevelGroups.map(mapGroup),
      ...topLevelProperties.map(mapProperty),
      ...propertiesWithoutShapes.map(mapProperty)
    ]
      .filter(nonNullable)
      .sort((a, b) => a[0] - b[0])
      .map(([_order, element]) => element)
  ]

  const description = shapePointer.out([sh('description'), rdfs('comment')]).values[0]

  return (
    <div className="node" data-term={shapePointer.values}>
      {description && ['edit'].includes(mode) ? <div className="node-description">{description}</div> : null}
      {formElements}
    </div>
  )
}
