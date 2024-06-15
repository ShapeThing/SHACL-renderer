import factory from '@rdfjs/data-model'
import { useContext } from 'react'
import parsePath from 'shacl-engine/lib/parsePath'
import IconPlus from '~icons/iconoir/plus'
import { dash, sh } from '../../core/namespaces'
import { scoreWidgets } from '../../core/scoreWidgets'
import { widgetsContext } from '../../widgets/widgets-context'
import PropertyElement from '../PropertyElement'
import PropertyObjectEditMode from './PropertyObjectEditMode'

type PropertyShapeEditModeProps = {
  property: GrapoiPointer
  data: GrapoiPointer
  facetSearchData: GrapoiPointer
  nodeDataPointer: GrapoiPointer
}

export default function PropertyShapeEditMode(props: PropertyShapeEditModeProps) {
  const { data: items, property, nodeDataPointer } = props
  const { editors } = useContext(widgetsContext)

  const addObject = () => {
    const path = parsePath(property.out(sh('path')))
    const lastPathPart = path.at(-1)
    if (lastPathPart.predicates.length > 1) throw new Error('Alternative property paths are not yet supported')
    const [predicate] = lastPathPart.predicates
    const widgetItem = scoreWidgets(editors, items, property, dash('editor'))
    const emptyTerm = widgetItem?.meta.createTerm ? widgetItem?.meta.createTerm() : factory.literal('')
    nodeDataPointer.addOut(predicate, emptyTerm)
  }

  return (
    <PropertyElement property={property}>
      <div className="editors">
        {items.map(item => (
          <div key={item.term.value}>
            <PropertyObjectEditMode {...props} data={item} />
          </div>
        ))}
      </div>
      <button onClick={addObject}>
        <IconPlus />
      </button>
    </PropertyElement>
  )
}
