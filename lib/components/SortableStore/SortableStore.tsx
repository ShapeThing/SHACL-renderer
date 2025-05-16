import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MeasuringStrategy,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { NamedNode, Quad_Subject } from '@rdfjs/types'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import Grapoi from '../../Grapoi'
import { sh } from '../../core/namespaces'
import Item from './Item'
import { wrapGetItems } from './helpers'

export type GrapoiWithId = Grapoi & { id: string; depth: number }

type Props = {
  getItems: (parent?: Quad_Subject) => Grapoi[]
  setItems: (items: Grapoi[]) => void
  itemIsGroup: (item: Grapoi) => boolean
  labelPredicates?: NamedNode[]
}

const measuring = {
  droppable: {
    strategy: MeasuringStrategy.Always
  }
}

export default function SortableStore(props: Props) {
  const { itemIsGroup, labelPredicates, getItems: givenGetItems, setItems: givenSetItems } = props
  const mouseSensor = useSensor(MouseSensor)
  const touchSensor = useSensor(TouchSensor)
  const keyboardSensor = useSensor(KeyboardSensor)
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor)
  const [active, setActive] = useState<UniqueIdentifier>()

  const getItems = wrapGetItems(givenGetItems)
  const [items, setItems] = useState(getItems())

  const activePointer = items.find(item => item.term.value === active)

  return (
    <DndContext
      onDragStart={event => {
        setActive(event.active.id)
      }}
      onDragEnd={event => {
        setActive(undefined)

        const activePointer = items.find(item => item.value === event.active.id)
        const overPointer = items.find(item => item.value === event.over?.id)

        if (activePointer && overPointer && !activePointer.term.equals(overPointer.term)) {
          const groupTerm = overPointer.out(sh('group')).term
          console.log(groupTerm.value)
          activePointer.deleteOut(sh('group'))
          if (groupTerm?.value) activePointer.addOut(groupTerm.value)

          // if (event.delta.x > 20) {
          //   // const groupTerm = overPointer.out(sh('group')).term
          //   // activePointer.deleteOut(sh('group'))
          //   // if (groupTerm?.value) activePointer.addOut(groupTerm.value)
          // }

          const sortedItems = arrayMove(items, items.indexOf(activePointer), items.indexOf(overPointer))

          // The side effect, the parent is responsible to change the data.
          givenSetItems(sortedItems)

          // Re-render
          setItems(getItems())
        }
      }}
      collisionDetection={closestCorners}
      id="list"
      sensors={sensors}
      measuring={measuring}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <ul>
          {items.map(item => (
            <Item
              group={itemIsGroup(item)}
              labelPredicates={labelPredicates}
              id={item.value}
              key={item.value}
              pointer={item}
              className={item.value === active ? 'active' : ''}
            />
          ))}
        </ul>

        {createPortal(
          <DragOverlay className="shape-editor">
            {activePointer ? (
              <Item
                id={activePointer.term.value}
                pointer={activePointer}
                group={itemIsGroup(activePointer)}
                className="ghost"
              />
            ) : null}
          </DragOverlay>,
          document.body
        )}
      </SortableContext>
    </DndContext>
  )
}
