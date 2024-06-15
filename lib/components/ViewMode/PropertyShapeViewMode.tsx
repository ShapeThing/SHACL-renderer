import { useContext } from 'react'
import { dash, stsr } from '../../core/namespaces'
import { scoreWidgets } from '../../core/scoreWidgets'
import { wrapWithList } from '../../helpers/wrapWithList'
import { widgetsContext } from '../../widgets/widgets-context'
import PropertyElement from '../PropertyElement'
import { PropertyShapeInnerProps } from '../PropertyShape'

export default function PropertyShapeViewMode(props: PropertyShapeInnerProps) {
  const { data, property } = props
  const selectedWidgetIri = property.out(dash('viewer')).term
  if (selectedWidgetIri?.equals(stsr('HideWidget'))) return null
  const { viewers } = useContext(widgetsContext)

  return (
    <PropertyElement showColon property={property}>
      {wrapWithList(
        data.map(item => {
          const widgetItem = scoreWidgets(viewers, data, property, dash('viewer'))

          return widgetItem ? (
            <widgetItem.Component {...props} key={item.term.value} data={item} term={item.term} />
          ) : null
        }),
        property
      )}
    </PropertyElement>
  )
}
