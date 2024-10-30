import { DatasetCore } from '@rdfjs/types'
import { Grapoi } from 'grapoi'
import isEqual from 'lodash-es/isEqual'
import { ReactComponentLike } from 'prop-types'
import { Suspense, useContext } from 'react'
import parsePath from 'shacl-engine/lib/parsePath'
import { Settings, mainContext } from '../core/main-context'
import { dash, sh, stf, stsr } from '../core/namespaces'
import { validationContext } from '../core/validation-context'
import PropertyShapeDataMode from './DataMode/PropertyShapeDataMode'
import PropertyShapeEditMode from './EditMode/PropertyShapeEditMode'
import PropertyShapeFacetMode from './FacetMode/PropertyShapeFacetMode'
import PropertyShapeInlineEditMode from './InlineEditMode/PropertyShapeInlineEditMode'
import PropertyShapeViewMode from './ViewMode/PropertyShapeViewMode'

type PropertyShapeProps = {
  property: Grapoi
  nodeDataPointer: Grapoi
  dataset: DatasetCore
  facetSearchDataPointer: Grapoi
}

export type PropertyShapeInnerProps = {
  nodeDataPointer: Grapoi
  property: Grapoi
  data: Grapoi
  path: any
  facetSearchData: Grapoi
}

const modes: Record<Settings['mode'], ReactComponentLike> = {
  edit: PropertyShapeEditMode,
  view: PropertyShapeViewMode,
  facet: PropertyShapeFacetMode,
  data: PropertyShapeDataMode,
  'inline-edit': PropertyShapeInlineEditMode
}

const modePredicates = {
  edit: dash('editor'),
  view: dash('viewer'),
  facet: stf('facet'),
  'inline-edit': dash('editor'),
  data: stsr('data')
}

export default function PropertyShape(props: PropertyShapeProps) {
  const { property } = props
  const { mode } = useContext(mainContext)

  const selectedWidgetIri = property.out(modePredicates[mode]).term
  if (selectedWidgetIri?.equals(stsr('HideWidget'))) return null

  const path = parsePath(property.out(sh('path')))
  const PropertyShapeInner = modes[mode]

  const { report } = useContext(validationContext)
  const errors = report?.results?.filter((result: { path: unknown }) => isEqual(result.path, path)) ?? []

  return PropertyShapeInner ? (
    <Suspense>
      <PropertyShapeInner {...props} errors={errors} path={path} />
    </Suspense>
  ) : null
}
