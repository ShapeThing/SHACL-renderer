import { ReactComponentLike } from 'prop-types'
import { Suspense, use } from 'react'
import parsePath from 'shacl-engine/lib/parsePath'
import { Settings, mainContext } from '../core/main-context'
import { sh } from '../core/namespaces'
import PropertyShapeEditMode from './PropertyShapeEditMode'
import PropertyShapeFacetMode from './PropertyShapeFacetMode'
import PropertyShapeInlineEditMode from './PropertyShapeInlineEditMode'
import PropertyShapeViewMode from './PropertyShapeViewMode'

type PropertyShapeProps = {
  property: GrapoiPointer
  nodeDataPointer: GrapoiPointer
}

export type PropertyShapeInnerProps = {
  property: GrapoiPointer
  data: GrapoiPointer
}

const modes: Record<Settings['mode'], ReactComponentLike> = {
  edit: PropertyShapeEditMode,
  view: PropertyShapeViewMode,
  facet: PropertyShapeFacetMode,
  'inline-edit': PropertyShapeInlineEditMode
}

export default function PropertyShape({ property, nodeDataPointer }: PropertyShapeProps) {
  const { mode } = use(mainContext)
  const path = parsePath(property.out(sh('path')))
  const dataPointer = nodeDataPointer.executeAll(path)
  const PropertyShapeInner = modes[mode]

  return (
    <div className="property" data-term={property.term.value}>
      <Suspense>
        <PropertyShapeInner data={dataPointer} property={property} />
      </Suspense>
    </div>
  )
}
