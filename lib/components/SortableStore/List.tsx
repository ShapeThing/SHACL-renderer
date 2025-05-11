import { useDndMonitor } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Quad_Subject } from '@rdfjs/types'
import { useContext, useState } from 'react'
import Item from './Item'
import { sortableStoreContext } from './context'

type Props = {
  parent?: Quad_Subject
}

export default function List({ parent }: Props) {
  const {
    getItems: givenGetItems,
    setItems: givenSetItems,
    itemIsGroup,
    labelPredicates
  } = useContext(sortableStoreContext)
  const [items, setItems] = useState(givenGetItems(parent))

  useDndMonitor({
    onDragEnd(event) {
      const activePointer = items.find(item => item.value === event.active.id)
      const overPointer = items.find(item => item.value === event.over?.id)

      if (activePointer && overPointer && !activePointer.term.equals(overPointer.term)) {
        const sortedItems = arrayMove(items, items.indexOf(activePointer), items.indexOf(overPointer))

        // The side effect, the parent is responsible to change the data.
        givenSetItems(sortedItems)

        // Re-render
        setItems(givenGetItems(parent))
      }
    }
  })

  return (
    <SortableContext items={items} strategy={verticalListSortingStrategy}>
      <ul>
        {items.map(item => (
          <Item
            group={itemIsGroup(item)}
            labelPredicates={labelPredicates}
            id={item.value}
            key={item.value}
            pointer={item}
          />
        ))}
      </ul>
    </SortableContext>
  )
}
