import { ReactComponentLike } from 'prop-types'
import { Suspense, use } from 'react'
import parsePath from 'shacl-engine/lib/parsePath'
import { Settings, mainContext } from '../core/main-context'
import { sh } from '../core/namespaces'
import PropertyShapeEditMode from './EditMode/PropertyShapeEditMode'
import PropertyShapeFacetMode from './FacetMode/PropertyShapeFacetMode'
import PropertyShapeInlineEditMode from './InlineEditMode/PropertyShapeInlineEditMode'
import PropertyShapeViewMode from './ViewMode/PropertyShapeViewMode'

type PropertyShapeProps = {
  property: GrapoiPointer
  nodeDataPointer: GrapoiPointer
  facetSearchDataPointer: GrapoiPointer
}

export type PropertyShapeInnerProps = {
  property: GrapoiPointer
  data: GrapoiPointer
  facetSearchData: GrapoiPointer
}

const modes: Record<Settings['mode'], ReactComponentLike> = {
  edit: PropertyShapeEditMode,
  view: PropertyShapeViewMode,
  facet: PropertyShapeFacetMode,
  'inline-edit': PropertyShapeInlineEditMode
}

export default function PropertyShape({ property, nodeDataPointer, facetSearchDataPointer }: PropertyShapeProps) {
  const { mode } = use(mainContext)
  const path = parsePath(property.out(sh('path')))
  let dataPointer = nodeDataPointer.executeAll(path)
  const facetSearchData = facetSearchDataPointer.executeAll(path)
  const PropertyShapeInner = modes[mode]

  if (!dataPointer.term) {
    // console.log(dataPointer)
  }

  if (mode === 'facet') {
    const predicate = property.out(sh('path')).term
    dataPointer = nodeDataPointer.out(sh('property')).distinct().hasOut(sh('path'), predicate)
  }

  return (
    <Suspense>
      <PropertyShapeInner
        key={property.term?.value + dataPointer.term?.value}
        facetSearchData={facetSearchData}
        data={dataPointer}
        property={property}
      />
    </Suspense>
  )
}
