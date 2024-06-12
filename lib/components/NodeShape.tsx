import factory from '@rdfjs/data-model'
import grapoi from 'grapoi'
import { ReactNode, useContext, useMemo } from 'react'
import { mainContext } from '../core/main-context'
import { rdf, sh } from '../core/namespaces'
import { nonNullable } from '../helpers/nonNullable'
import PropertyGroup from './PropertyGroup'
import PropertyShape from './PropertyShape'

export type NodeShapeProps = {
  shapePointer?: GrapoiPointer
  dataPointer?: GrapoiPointer
  facetSearchDataPointer?: GrapoiPointer
}

export default function NodeShape({
  shapePointer: specificShapePointer,
  dataPointer: specificDataPointer,
  facetSearchDataPointer: specificFacetSearchDataPointer
}: NodeShapeProps) {
  const {
    shapes,
    shapePointer: mainShapePointer,
    dataPointer: mainDataPointer,
    facetSearchDataPointer: mainFacetSearchDataPointer,
    mode
  } = useContext(mainContext)

  const { elements, shapePointer } = useMemo(() => {
    const shapePointer = specificShapePointer ?? mainShapePointer
    const nodeDataPointer = specificDataPointer ?? mainDataPointer
    const facetSearchDataPointer = specificFacetSearchDataPointer ?? mainFacetSearchDataPointer

    console.log('tes', shapePointer.term)
    const pointer = grapoi({ dataset: shapes, factory })
    const properties = shapePointer.out(sh('property'))
    const propertiesWithGroups = properties.filter(pointer => pointer.out(sh('group')).term)
    const groups = [...pointer.hasOut(rdf('type'), sh('PropertyGroup'))]

    const sortablePropertyWithGroups: [number, ReactNode][] = groups
      .map(group => {
        const groupProperties = [...propertiesWithGroups.hasOut(sh('group'), group.term)]
        return groupProperties.length ? { group, properties: groupProperties } : null
      })
      .filter(nonNullable)
      .map(({ group, properties }) => {
        return [
          parseInt(group.out(sh('order')).value as string) ?? 0,
          <PropertyGroup
            facetSearchDataPointer={facetSearchDataPointer}
            nodeDataPointer={nodeDataPointer}
            group={group}
            key={group.term.value}
            properties={properties}
          />
        ]
      })

    const sortablePropertyWithoutGroups: [number, ReactNode][] = [
      ...properties.filter(pointer => !pointer.out(sh('group')).term)
    ].map(property => {
      return [
        parseInt(property.out(sh('order')).value as string) ?? 0,
        <PropertyShape
          facetSearchDataPointer={facetSearchDataPointer}
          nodeDataPointer={nodeDataPointer}
          key={property.term.value}
          property={property}
        />
      ]
    })

    return {
      elements: [...sortablePropertyWithGroups, ...sortablePropertyWithoutGroups]
        .sort((a, b) => a[0] - b[0])
        .map(([_order, element]) => element),
      shapePointer
    }
  }, [])

  return (
    <div className="node" data-mode={mode} data-term={shapePointer.term.value}>
      {elements}
    </div>
  )
}
