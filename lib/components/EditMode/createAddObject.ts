import factory from '@rdfjs/data-model'
import parsePath from 'shacl-engine/lib/parsePath'
import { dash, sh } from '../../core/namespaces'
import { scoreWidgets } from '../../core/scoreWidgets'
import { WidgetItem } from '../../widgets/widgets-context'

export const createAddObject =
  (editors: WidgetItem[], property: GrapoiPointer, items: GrapoiPointer, parentData: GrapoiPointer) => () => {
    const path = parsePath(property.out(sh('path')))
    const lastPathPart = path.at(-1)
    if (lastPathPart.predicates.length > 1) throw new Error('Alternative property paths are not yet supported')
    const [predicate] = lastPathPart.predicates
    const widgetItem = scoreWidgets(editors, items, property, dash('editor'))
    const emptyTerm = widgetItem?.meta.createTerm ? widgetItem?.meta.createTerm() : factory.literal('')
    parentData.addOut(predicate, emptyTerm)
  }
