import IconPlus from '~icons/iconoir/plus'
import { dash, stsr } from '../../core/namespaces'
import PropertyElement from '../PropertyElement'
import PropertyObjectEditMode from './PropertyObjectEditMode'

type PropertyShapeEditModeProps = {
  property: GrapoiPointer
  data: GrapoiPointer
}

export default function PropertyShapeEditMode({ data, property }: PropertyShapeEditModeProps) {
  const items = data

  const selectedWidgetIri = property.out(dash('editor')).term
  if (selectedWidgetIri?.equals(stsr('HideWidget'))) return null

  return (
    <PropertyElement property={property}>
      <div className="editors">
        {items.map(item => (
          <div key={item.term.value}>
            <PropertyObjectEditMode data={item} property={property} />
          </div>
        ))}
      </div>
      <button>
        <IconPlus />
      </button>
    </PropertyElement>
  )
}
