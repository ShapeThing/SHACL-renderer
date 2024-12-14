import factory from '@rdfjs/data-model'
import type { Term } from '@rdfjs/types'
import grapoi from 'grapoi'
import { ReactNode, useContext } from 'react'
import { mainContext } from '../core/main-context'
import { rdf, rdfs, sh } from '../core/namespaces'
import { nonNullable } from '../helpers/nonNullable'
import CollapsiblePropertyGroup from './CollapsiblePropertyGroup'
import PropertyGroup from './PropertyGroup'
import PropertyShape from './PropertyShape'

const propertyGroupTypes = {
  _default: PropertyGroup,
  CollapsiblePropertyGroup: CollapsiblePropertyGroup
}

export default function NodeShape() {
  const { shapePointer, mode, dataPointer, facetSearchDataPointer, data: dataset } = useContext(mainContext)

  const isClosed = shapePointer.out(sh('closed')).value === 'true'

  const properties = shapePointer.out(sh('property'))
  const propertiesWithGroups = properties.filter(pointer => !!pointer.out(sh('group')).term)
  const groups = [...shapePointer.node().hasOut(rdf('type'), sh('PropertyGroup'))]

  const usedPredicates: Set<string> = new Set()

  const sortablePropertyWithGroups: [number, ReactNode][] = groups
    .map(group => {
      const groupProperties = [...propertiesWithGroups.hasOut(sh('group'), group.term)]
      const groupType = group.out(rdf('type')).filter(pointer => !pointer.term.equals(sh('PropertyGroup')))
      const type = (groupType.values
        .map(value => value.split(/\/|\#/g).pop())
        .find(type => (type ? Object.keys(propertyGroupTypes).includes(type) : false)) ??
        '_default') as keyof typeof propertyGroupTypes
      const Element = propertyGroupTypes[type]

      for (const groupProperty of groupProperties) {
        const path: Term = groupProperty.out(sh('path')).term
        if (path.termType !== 'NamedNode') throw new Error('We do not support anything other than named nodes yet.')
        usedPredicates.add(path.value)
      }
      return groupProperties.length ? { group, properties: groupProperties, Element } : null
    })
    .filter(nonNullable)
    .map(({ group, properties, Element }) => {
      return [
        parseInt(group.out(sh('order')).value as string) ?? 0,
        <Element
          key={group.term.value}
          facetSearchDataPointer={facetSearchDataPointer}
          nodeDataPointer={dataPointer}
          group={group}
          properties={properties}
        />
      ]
    })

  const sortablePropertyWithoutGroups: [number, ReactNode][] = [
    ...properties.filter(pointer => !pointer.out(sh('group')).term)
  ].map(property => {
    usedPredicates.add(property.out(sh('path')).value)

    return [
      parseFloat(property.out(sh('order')).value as string) ?? 0,
      <PropertyShape
        dataset={dataset}
        key={property.term.value}
        facetSearchDataPointer={facetSearchDataPointer}
        nodeDataPointer={dataPointer}
        property={property}
      />
    ]
  })

  const predicatesWithoutPropertyShapes = new Map(
    [...dataPointer.out().quads()]
      .filter(quad => !usedPredicates.has(quad.predicate.value))
      .map(quad => [quad.predicate.value, quad.predicate])
  )

  const propertiesWithoutPropertyShapes: ReactNode[] = !isClosed
    ? [...predicatesWithoutPropertyShapes.values()].map(predicate => {
        const dataset = shapePointer.ptrs[0].dataset

        const propertyIri = factory.namedNode(`int:${predicate.value}`)

        const quads = [
          factory.quad(factory.namedNode(''), sh('property'), propertyIri),
          factory.quad(propertyIri, rdf('type'), sh('PropertyShape')),
          factory.quad(propertyIri, sh('path'), predicate)
        ]
        for (const quad of quads) dataset.add(quad)

        const property = grapoi({ dataset, factory, term: propertyIri })

        return (
          <PropertyShape
            dataset={dataset}
            key={property.term.value}
            facetSearchDataPointer={facetSearchDataPointer}
            nodeDataPointer={dataPointer}
            property={property}
          />
        )
      })
    : []

  const elements = [
    ...[...sortablePropertyWithGroups, ...sortablePropertyWithoutGroups]
      .sort((a, b) => a[0] - b[0])
      .map(([_order, element]) => element),
    ...propertiesWithoutPropertyShapes
  ]

  const description = shapePointer.out([sh('description'), rdfs('comment')]).values[0]

  return (
    <div className="node" data-term={shapePointer.values}>
      {description && ['edit'].includes(mode) ? <div>{description}</div> : null}
      {elements}
    </div>
  )
}
