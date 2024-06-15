import { dash, stsr } from '../../core/namespaces'
import { wrapWithList } from '../../helpers/wrapWithList'
import PropertyElement from '../PropertyElement'
import { PropertyShapeInnerProps } from '../PropertyShape'
import PropertyObjectInlineEditMode from './PropertyObjectInlineEditMode'

export default function PropertyShapeInlineEditMode(props: PropertyShapeInnerProps) {
  const { data, property } = props
  const selectedEditorIri = property.out(dash('editor')).term
  const selectedViewerIri = property.out(dash('viewer')).term
  if (selectedEditorIri?.equals(stsr('HideWidget')) || selectedViewerIri?.equals(stsr('HideWidget'))) return null

  return (
    <PropertyElement showColon property={property}>
      {wrapWithList(
        data.map(item => (
          <PropertyObjectInlineEditMode {...props} key={property.term?.value + item.term?.value} data={item} />
        )),
        property
      )}
    </PropertyElement>
  )
}
