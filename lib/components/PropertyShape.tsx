import { Grapoi } from 'grapoi'
import isEqual from 'lodash-es/isEqual'
import { ReactComponentLike } from 'prop-types'
import { Suspense, useContext } from 'react'
import parsePath from 'shacl-engine/lib/parsePath'
import { Settings, mainContext } from '../core/main-context'
import { dash, sh, stf, stsr } from '../core/namespaces'
import { validationContext } from '../core/validation-context'
import PropertyShapeEditMode from './EditMode/PropertyShapeEditMode'
import PropertyShapeFacetMode from './FacetMode/PropertyShapeFacetMode'
import PropertyShapeInlineEditMode from './InlineEditMode/PropertyShapeInlineEditMode'
import PropertyShapeViewMode from './ViewMode/PropertyShapeViewMode'

type PropertyShapeProps = {
  property: Grapoi
  nodeDataPointer: Grapoi
  facetSearchDataPointer: Grapoi
}

export type PropertyShapeInnerProps = {
  nodeDataPointer: Grapoi
  property: Grapoi
  data: Grapoi
  facetSearchData: Grapoi
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

  const report = useContext(validationContext)
  const errors = report?.results?.filter((result: { path: unknown }) => isEqual(result.path, path)) ?? []

  return PropertyShapeInner ? (
    <Suspense>
      <PropertyShapeInner {...props} errors={errors} facetSearchData={facetSearchData} data={data} />
    </Suspense>
  ) : null
}
