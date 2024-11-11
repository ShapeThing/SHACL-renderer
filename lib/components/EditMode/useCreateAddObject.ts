import type { Grapoi } from 'grapoi'
import { dash, sh } from '../../core/namespaces'
import { scoreWidgets } from '../../core/scoreWidgets'
import parsePath from '../../helpers/parsePath'
import { replaceList } from '../../helpers/replaceList'
import { TouchableTerm } from '../../helpers/touchableRdf'
import type { WidgetItem } from '../../widgets/widgets-context'

export const useCreateAddObject =
  (
    editors: WidgetItem[],
    property: Grapoi,
    items: Grapoi,
    parentData: Grapoi,
    setItems: () => void,
    isList: boolean = false
  ) =>
  ({ activeContentLanguage }: { activeContentLanguage?: string }) => {
    const path = parsePath(property.out(sh('path')))
    const firstPathPart = path?.at(0)
    if (firstPathPart.predicates.length > 1) throw new Error('Alternative property paths are not yet supported')
    const [predicate] = firstPathPart.predicates

    const widgetItem = scoreWidgets(editors, items, property, dash('editor'))
    const emptyTerm = widgetItem?.meta.createTerm ? widgetItem?.meta.createTerm({ activeContentLanguage }) : null
    if (!emptyTerm) return
    ;(emptyTerm as TouchableTerm).touched = false

    if (isList) {
      const terms = [...[...items].map((item: Grapoi) => item.term), emptyTerm]
      const pointer = parentData.executeAll([path[0]])
      replaceList(terms, pointer)
    } else {
      parentData.addOut(predicate, emptyTerm)
    }

    setItems()
  }
