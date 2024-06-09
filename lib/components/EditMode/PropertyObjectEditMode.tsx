import { getWidget } from '../../helpers/getWidget'
import { PropertyShapeInnerProps } from '../PropertyShape'

type PropertyObjectEditModeProps = PropertyShapeInnerProps

export default function PropertyObjectEditMode({ data, property }: PropertyObjectEditModeProps) {
  const Editor = getWidget('editors', property, data)

  return Editor ? (
    <div key={data.term.value}>
      <Editor term={data.term} />
      <button>x</button>
    </div>
  ) : null
}
