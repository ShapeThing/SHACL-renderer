import factory from '@rdfjs/data-model'
import grapoi from 'grapoi'
import { use, useState } from 'react'
import { mainContext } from '../core/main-context'
import { rdf, sh } from '../core/namespaces'
import { nonNullable } from '../helpers/nonNullable'
import { sortShaclItems } from '../helpers/sortShaclItems'
import PropertyGroup from './PropertyGroup'
import PropertyShape from './PropertyShape'

export type NodeShapeProps = {
  shapePointer?: GrapoiPointer
}

export default function NodeShape({ shapePointer: specificShapePointer }: NodeShapeProps) {
  const { shapes, shapePointer: mainShapePointer } = use(mainContext)
  const shapePointer = specificShapePointer ?? mainShapePointer

  const [{ properties }] = useState(() => {
    const pointer = grapoi({ dataset: shapes, factory })
    const properties = shapePointer.out(sh('property'))
    const propertiesWithGroups = properties.filter(pointer => pointer.out(sh('group')).term)
    const groups = [...pointer.hasOut(rdf('type'), sh('PropertyGroup'))].sort(sortShaclItems)
    const propertiesWithoutGroups = [...properties.filter(pointer => !pointer.out(sh('group')).term)].sort(
      sortShaclItems
    )

    return {
      pointer,
      properties: {
        withoutGroups: propertiesWithoutGroups,
        withGroups: groups
          .map(group => {
            const groupProperties = [...propertiesWithGroups.hasOut(sh('group'), group.term)].sort(sortShaclItems)
            return groupProperties.length ? { group, properties: groupProperties } : null
          })
          .filter(nonNullable)
      }
    }
  })

  return (
    <div className="node" data-term={shapePointer.term.value}>
      {properties.withoutGroups.map(property => (
        <PropertyShape key={property.term.value} property={property} />
      ))}

      {properties.withGroups.map(({ group, properties }) => (
        <PropertyGroup group={group} key={group.term.value} properties={properties} />
      ))}
    </div>
  )
}
