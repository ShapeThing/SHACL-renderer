import { ComponentType, ReactNode, useContext } from 'react'
import { stsr } from '../core/namespaces'
import Grapoi from '../Grapoi'
import CommaList from '../widgets/lists/CommaList'
import { widgetsContext } from '../widgets/widgets-context'

export const wrapWithList = (items: ReactNode[], property: Grapoi) => {
  const { lists } = useContext(widgetsContext)
  const stsrListType = property.out(stsr('listType')).term
  const listType = lists.find(list => stsrListType?.equals(list.meta.iri))
  const List = listType ? (listType.Component as unknown as ComponentType<{ items: any[] }>) : CommaList
  return items.length > 1 ? <List items={items}></List> : items[0]
}
