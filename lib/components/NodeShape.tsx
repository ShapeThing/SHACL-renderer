import factory from '@rdfjs/data-model'
import { Term } from '@rdfjs/types'
import grapoi from 'grapoi'
import { ReactNode, useContext } from 'react'
import { mainContext } from '../core/main-context'
import { rdf, sh } from '../core/namespaces'
import { nonNullable } from '../helpers/nonNullable'
import PropertyGroup from './PropertyGroup'
import PropertyShape from './PropertyShape'

export default function NodeShape() {
  const { mode, shapePointer, dataPointer, facetSearchDataPointer, data: dataset } = useContext(mainContext)

  const isClosed = shapePointer.out(sh('closed')).value === 'true'

  const properties = shapePointer.out(sh('property'))
  const propertiesWithGroups = properties.filter(pointer => !!pointer.out(sh('group')).term)
  const groups = [...shapePointer.node().hasOut(rdf('type'), sh('PropertyGroup'))]

  const usedPredicates: Set<string> = new Set()

  const sortablePropertyWithGroups: [number, ReactNode][] = groups
    .map(group => {
      const groupProperties = [...propertiesWithGroups.hasOut(sh('group'), group.term)]

      for (const groupProperty of groupProperties) {
        const path: Term = groupProperty.out(sh('path')).term
        if (path.termType !== 'NamedNode') throw new Error('We do not support anything other than named nodes yet.')
        usedPredicates.add(path.value)
      }
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
        dataset={dataset}
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

  const propertiesWithoutNodeShapes: ReactNode[] = !isClosed
    ? [...predicatesWithoutNodeShapes.values()].map(predicate => {
        const dataset = shapePointer.ptrs[0].dataset

        const propertyIri = factory.namedNode(`int:${predicate.value}`)

        const quads = [
          factory.quad(factory.namedNode(''), sh('property'), propertyIri),
          factory.quad(propertyIri, rdf('type'), sh('PropertyShape')),
          factory.quad(propertyIri, sh('path'), predicate)
        ]
        for (const quad of quads) dataset.add(quad)

        const propertyPointer = grapoi({ dataset, factory, term: propertyIri })

        return (
          <PropertyShape
            dataset={dataset}
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

  return ['data', 'type'].includes(mode) ? (
    <node>{elements}</node>
  ) : (
    <div className="node" data-mode={mode} data-term={shapePointer.term.value}>
      {elements}
    </div>
  )
}
