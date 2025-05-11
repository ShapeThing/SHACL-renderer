import { DndContext } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import { Quad_Subject } from '@rdfjs/types'
import { useState } from 'react'
import Grapoi from '../../Grapoi'
import Item from './Item'

type Props = {
  getItems: (parent?: Quad_Subject) => Grapoi[]
  setItems: (items: Grapoi[]) => void
}

type GrapoiWithId = Grapoi & { id: string }

export default function SortableStore({ getItems: getItemsGiven, setItems: setItemsGiven }: Props) {
  const getItems: () => GrapoiWithId[] = () =>
    getItemsGiven().flatMap(pointer =>
      pointer.map((innerPointer: GrapoiWithId) => {
        innerPointer.id = innerPointer.value!
        return innerPointer
      })
    )

  const [items, setItems] = useState(getItems())

  return (
    <DndContext
      onDragEnd={event => {
        const activePointer = items.find(item => item.value === event.active.id)
        const overPointer = items.find(item => item.value === event.over?.id)

        if (activePointer && overPointer && !activePointer.term.equals(overPointer.term)) {
          const itemsWithoutActive = items.filter(item => item !== activePointer)
          const overIndex = itemsWithoutActive.indexOf(overPointer)
          const newPosition = event.delta.y <= 0 ? overIndex : overIndex + 1
          itemsWithoutActive.splice(newPosition, 0, activePointer)

          // The side effect, the parent is responsible to change the data.
          setItemsGiven(itemsWithoutActive)

          // Re-render
          setItems(getItems())
        }
      }}
    >
      <SortableContext items={items}>
        {items.map(item => (
          <Item id={item.value} key={item.value} term={item.term} />
        ))}
      </SortableContext>
    </DndContext>
  )
}
