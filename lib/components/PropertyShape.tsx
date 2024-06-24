import { ReactComponentLike } from 'prop-types'
import { Suspense, useContext, useReducer } from 'react'
import parsePath from 'shacl-engine/lib/parsePath'
import { Settings, mainContext } from '../core/main-context'
import { dash, sh, stf, stsr } from '../core/namespaces'
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
  nodeDataPointer: GrapoiPointer
  property: GrapoiPointer
  data: GrapoiPointer
  facetSearchData: GrapoiPointer
  rerenderProperty: () => void
}

const modes: Record<Settings['mode'], ReactComponentLike> = {
  edit: PropertyShapeEditMode,
  view: PropertyShapeViewMode,
  facet: PropertyShapeFacetMode,
  'inline-edit': PropertyShapeInlineEditMode
}

const modePredicates = {
  edit: dash('editor'),
  view: dash('viewer'),
  facet: stf('facet'),
  'inline-edit': dash('editor')
}

export default function PropertyShape(props: PropertyShapeProps) {
  const { property, nodeDataPointer, facetSearchDataPointer } = props
  const { mode } = useContext(mainContext)
  const [, forceUpdate] = useReducer(x => x + 1, 0)

  const selectedWidgetIri = property.out(modePredicates[mode]).term
  if (selectedWidgetIri?.equals(stsr('HideWidget'))) return null

  const path = parsePath(property.out(sh('path')))
  let data = nodeDataPointer.executeAll(path)
  const facetSearchData = facetSearchDataPointer.executeAll(path)
  const PropertyShapeInner = modes[mode]

  if (mode === 'facet') {
    const predicate = property.out(sh('path')).term
    data = nodeDataPointer.out(sh('property')).distinct().hasOut(sh('path'), predicate)
  }

  return PropertyShapeInner ? (
    <Suspense>
      <PropertyShapeInner {...props} rerenderProperty={forceUpdate} facetSearchData={facetSearchData} data={data} />
    </Suspense>
  ) : null
}
