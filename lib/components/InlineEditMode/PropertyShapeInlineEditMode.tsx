import { dash, stsr } from '../../core/namespaces'
import { wrapWithList } from '../../helpers/wrapWithList'
import PropertyElement from '../PropertyElement'
import { PropertyShapeInnerProps } from '../PropertyShape'
import PropertyObjectInlineEditMode from './PropertyObjectInlineEditMode'

export default function PropertyShapeInlineEditMode({ data, property }: PropertyShapeInnerProps) {
  const selectedEditorIri = property.out(dash('editor')).term
  const selectedViewerIri = property.out(dash('viewer')).term
  if (selectedEditorIri?.equals(stsr('HideWidget')) || selectedViewerIri?.equals(stsr('HideWidget'))) return null

  return (
    <PropertyElement showColon property={property}>
      {wrapWithList(
        data.map(item => (
          <PropertyObjectInlineEditMode key={property.term?.value + item.term?.value} data={item} property={property} />
        )),
        property
      )}
    </PropertyElement>
  )
}
