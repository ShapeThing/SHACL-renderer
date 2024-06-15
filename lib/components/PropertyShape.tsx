import { ReactComponentLike } from 'prop-types'
import { Suspense, useContext, useMemo } from 'react'
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

export default function PropertyShape(props: PropertyShapeProps) {
  const { property, nodeDataPointer, facetSearchDataPointer } = props
  const { mode } = useContext(mainContext)

  const { PropertyShapeInner, data, facetSearchData } = useMemo(() => {
    const path = parsePath(property.out(sh('path')))
    let data = nodeDataPointer.executeAll(path)
    const facetSearchData = facetSearchDataPointer.executeAll(path)
    const PropertyShapeInner = modes[mode]

    if (!data.term) {
      // console.log(dataPointer)
    }

    if (mode === 'facet') {
      const predicate = property.out(sh('path')).term
      data = nodeDataPointer.out(sh('property')).distinct().hasOut(sh('path'), predicate)
    }

    return {
      PropertyShapeInner,
      data,
      facetSearchData
    }
  }, [])

  return (
    <Suspense>
      <PropertyShapeInner {...props} key={property.term?.value} facetSearchData={facetSearchData} data={data} />
    </Suspense>
  )
}
