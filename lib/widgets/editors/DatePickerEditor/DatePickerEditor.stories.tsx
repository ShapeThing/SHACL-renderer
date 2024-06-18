import factory from '@rdfjs/data-model'
import DatePickerEditor from '.'
import { xsd } from '../../../components/ShaclRenderer'
import { WidgetProps } from '../../widgets-context'

export default {
  title: 'Widgets/Editors/DatePickerEditor',
  component: DatePickerEditor,
  argTypes: {}
}

export const Widget = {
  args: {
    term: factory.literal('1947-01-14', xsd('date'))
  } as WidgetProps
}
