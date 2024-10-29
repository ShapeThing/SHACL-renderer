import { Grapoi } from 'grapoi'
import parsePath from 'shacl-engine/lib/parsePath'
import { dash, sh } from '../../core/namespaces'
import { scoreWidgets } from '../../core/scoreWidgets'
import { TouchableTerm } from '../../helpers/touchableRdf'
import { WidgetItem } from '../../widgets/widgets-context'

export const useCreateAddObject =
  (editors: WidgetItem[], property: Grapoi, items: Grapoi, parentData: Grapoi, setItems: () => void) =>
  ({ activeContentLanguage }: { activeContentLanguage?: string }) => {
    const path = parsePath(property.out(sh('path')))
    const lastPathPart = path.at(-1)
    if (lastPathPart.predicates.length > 1) throw new Error('Alternative property paths are not yet supported')
    const [predicate] = lastPathPart.predicates

    const widgetItem = scoreWidgets(editors, items, property, dash('editor'))
    const emptyTerm = widgetItem?.meta.createTerm ? widgetItem?.meta.createTerm({ activeContentLanguage }) : null
    if (!emptyTerm) return
    ;(emptyTerm as TouchableTerm).touched = false
    parentData.addOut(predicate, emptyTerm)
    setItems()
  }
