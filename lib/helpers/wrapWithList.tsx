import { ReactNode, use } from 'react'
import { stsr } from '../core/namespaces'
import { resolveWidgetComponent } from '../core/resolveWidgetComponent'
import CommaList from '../widgets/lists/CommaList'
import { widgetsContext } from '../widgets/widgets-context'

export const wrapWithList = (items: ReactNode[], property: GrapoiPointer) => {
  const { lists } = use(widgetsContext)
  const stsrListType = property.out(stsr('listType')).term
  const listType = lists.find(list => stsrListType?.equals(list.meta.iri))
  const List = listType ? resolveWidgetComponent(listType) : CommaList
  return items.length > 1 ? <List items={items}></List> : items[0]
}
