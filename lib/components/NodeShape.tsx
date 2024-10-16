import factory from '@rdfjs/data-model'
import datasetFactory from '@rdfjs/dataset'
import grapoi from 'grapoi'
import { ReactNode, useContext } from 'react'
import { mainContext } from '../core/main-context'
import { rdf, sh } from '../core/namespaces'
import { nonNullable } from '../helpers/nonNullable'
import PropertyGroup from './PropertyGroup'
import PropertyShape from './PropertyShape'

const blacklist = [rdf('type')]

export default function NodeShape() {
  const { mode, shapePointer, dataPointer, facetSearchDataPointer } = useContext(mainContext)

  const isClosed = shapePointer.out(sh('closed')).value === 'true'

  const properties = shapePointer.out(sh('property'))
  const propertiesWithGroups = properties.filter(pointer => !!pointer.out(sh('group')).term)
  const groups = [...shapePointer.node().hasOut(rdf('type'), sh('PropertyGroup'))]

  const usedPredicates: Set<string> = new Set()

  const sortablePropertyWithGroups: [number, ReactNode][] = groups
    .map(group => {
      const groupProperties = [...propertiesWithGroups.hasOut(sh('group'), group.term)]
      // TOD this only works for simple sh:path
      for (const predicate of groupProperties.map(groupProperty => groupProperty.out(sh('path')).value))
        usedPredicates.add(predicate)
      return groupProperties.length ? { group, properties: groupProperties } : null
    })
    .filter(nonNullable)
    .map(({ group, properties }) => {
      return [
        parseInt(group.out(sh('order')).value as string) ?? 0,
        <PropertyGroup
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
      parseInt(property.out(sh('order')).value as string) ?? 0,
      <PropertyShape
        facetSearchDataPointer={facetSearchDataPointer}
        nodeDataPointer={dataPointer}
        property={property}
      />
    ]
  })

  const predicatesWithoutNodeShapes = new Map(
    [...dataPointer.out().quads()]
      .filter(quad => !usedPredicates.has(quad.predicate.value))
      .map(quad => [quad.predicate.value, quad.predicate])
  )

  // For now we have a blacklist that remove rdf:type. TODO Do we need this?
  for (const predicate of blacklist) predicatesWithoutNodeShapes.delete(predicate.value)

  const propertiesWithoutNodeShapes: ReactNode[] = !isClosed
    ? [...predicatesWithoutNodeShapes.values()].map(predicate => {
        const dataset = datasetFactory.dataset([
          factory.quad(factory.namedNode(''), rdf('type'), sh('PropertyShape')),
          factory.quad(factory.namedNode(''), sh('path'), predicate)
        ])

        const propertyPointer = grapoi({ dataset, factory, term: factory.namedNode('') })

        return (
          <PropertyShape
            facetSearchDataPointer={facetSearchDataPointer}
            nodeDataPointer={dataPointer}
            property={propertyPointer}
          />
        )
      })
    : []

  const elements = [
    ...[...sortablePropertyWithGroups, ...sortablePropertyWithoutGroups]
      .sort((a, b) => a[0] - b[0])
      .map(([_order, element]) => element),
    ...propertiesWithoutNodeShapes
  ]

  return (
    <div className="node" data-mode={mode} data-term={shapePointer.term.value}>
      {elements}
    </div>
  )
}
