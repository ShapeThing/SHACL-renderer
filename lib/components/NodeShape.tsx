import factory from '@rdfjs/data-model'
import { DatasetCore } from '@rdfjs/types'
import grapoi from 'grapoi'
import { ReactNode, useContext } from 'react'
import { mainContext } from '../core/main-context'
import { rdf, rdfs, sh } from '../core/namespaces'
import Grapoi from '../Grapoi'
import { nonNullable } from '../helpers/nonNullable'
import parsePath from '../helpers/parsePath'
import CollapsiblePropertyGroup from './groups/CollapsiblePropertyGroup'
import DrawerPropertyGroup from './groups/DrawerPropertyGroup'
import HorizontalPropertyGroup from './groups/HorizontalPropertyGroup'
import PropertyGroup from './groups/PropertyGroup'
import PropertyShape from './PropertyShape'
import SubjectEditor from './SubjectEditor'

const propertyGroupTypes = {
  _default: PropertyGroup,
  CollapsiblePropertyGroup,
  HorizontalPropertyGroup,
  DrawerPropertyGroup
}

export const getElementHelpers = ({
  shapePointer,
  facetSearchDataPointer,
  dataPointer,
  dataset,
  mode
}: {
  shapePointer: Grapoi
  facetSearchDataPointer: Grapoi
  dataPointer: Grapoi
  dataset: DatasetCore
  mode: string
}) => {
  const keyPrefix = shapePointer.values.join(',') + ':' + dataPointer.values.join(',') + ':'

  const hasValuePredicatePointers = shapePointer.out(sh('property')).hasOut(sh('hasValue'))
  const hasValuePredicates = hasValuePredicatePointers.out(sh('path')).terms
  const ignoredProperties = [
    ...(shapePointer.out(sh('ignoredProperties')).isList()
      ? /** @ts-ignore */
        [...shapePointer.out(sh('ignoredProperties')).list()].map(pointer => pointer.term)
      : []),
    ...hasValuePredicates
  ]

  for (const hasValuePredicatePointer of hasValuePredicatePointers) {
    const predicate = hasValuePredicatePointer.out(sh('path')).term
    const object = hasValuePredicatePointer.out(sh('hasValue'))
    dataPointer.addOut(predicate, object)
  }

  const mapGroup = (group: Grapoi) => {
    const groupType = group.out(rdf('type')).filter(pointer => !pointer.term.equals(sh('PropertyGroup')))
    const type = (groupType.values
      .map(value => value.split(/\/|\#/g).pop())
      .find(type => (type && mode === 'edit' ? Object.keys(propertyGroupTypes).includes(type) : false)) ??
      '_default') as keyof typeof propertyGroupTypes
    const Element = propertyGroupTypes[type]

    return [
      parseInt(group.out(sh('order')).value as string) ?? 0,
      <Element
        key={keyPrefix + group.term.value}
        shapePointer={shapePointer}
        facetSearchDataPointer={facetSearchDataPointer}
        nodeDataPointer={dataPointer}
        group={group}
      />
    ] as [number, ReactNode]
  }

  const mapProperty = (property: Grapoi) => {
    const path = parsePath(property.out(sh('path')))
    const items = dataPointer.executeAll(path)

    return ignoredProperties.some(term => term.equals(property.out(sh('path')).term))
      ? null
      : ([
          parseFloat(property.out(sh('order')).value as string) ?? 0,
          <PropertyShape
            dataset={dataset}
            key={keyPrefix + property.term.value}
            facetSearchDataPointer={facetSearchDataPointer}
            nodeDataPointer={dataPointer}
            property={property}
          />,
          items.ptrs.length > 0,
          property
        ] as [number, ReactNode, boolean, Grapoi])
  }
  return { mapGroup, mapProperty }
}

export default function NodeShape() {
  const { shapePointer, mode, dataPointer, facetSearchDataPointer, data: dataset, shapes } = useContext(mainContext)

  const properties: Grapoi = shapePointer.out(sh('property'))
  const groups = [...shapePointer.node().hasOut(rdf('type'), sh('PropertyGroup'))]

  const topLevelGroups = groups.filter(group => !group.hasOut(sh('group')).term)
  const topLevelProperties = [...properties.filter(pointer => !pointer.out(sh('group')).term)]
  const usedPredicates = [...properties].flatMap((property: Grapoi) => {
    if (property.out(sh('path')).isList()) {
      /** @ts-ignore */
      const list = [...property.out(sh('path')).list()]
      return list.flatMap(i => i.values)
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
    for (const quad of quads) shapes.add(quad)
    return grapoi({ dataset: shapes, factory, term: propertyIri })
  })

  const { mapGroup, mapProperty } = getElementHelpers({
    shapePointer,
    dataPointer,
    facetSearchDataPointer,
    dataset,
    mode
  })

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
      <SubjectEditor />
      {formElements}
    </div>
  )
}
