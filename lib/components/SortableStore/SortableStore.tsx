import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  MeasuringStrategy,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { NamedNode, Quad_Subject } from '@rdfjs/types'
import Grapoi from '../../Grapoi'
import { sortableStoreContext } from './context'
import List from './List'

export type GrapoiWithId = Grapoi & { id: string }

type Props = {
  getItems: (parent?: Quad_Subject) => Grapoi[]
  setItems: (items: Grapoi[]) => void
  itemIsGroup: (item: Grapoi) => boolean
  labelPredicates?: NamedNode[]
}

const measuring = {
  droppable: {
    strategy: MeasuringStrategy.BeforeDragging
  }
}

const getItems: (getItemsGiven: (parent?: Quad_Subject) => Grapoi[]) => () => GrapoiWithId[] =
  getItemsGiven => (parent?: Quad_Subject) =>
    getItemsGiven(parent).flatMap(pointer =>
      pointer.map((innerPointer: GrapoiWithId) => {
        innerPointer.id = innerPointer.value!
        return innerPointer
      })
    )

export default function SortableStore(props: Props) {
  const mouseSensor = useSensor(MouseSensor)
  const touchSensor = useSensor(TouchSensor)
  const keyboardSensor = useSensor(KeyboardSensor)
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor)

  return (
    <DndContext collisionDetection={closestCorners} id="list" sensors={sensors} measuring={measuring}>
      <sortableStoreContext.Provider value={{ ...props, getItems: getItems(props.getItems) }}>
        <List />
      </sortableStoreContext.Provider>
    </DndContext>
  )
}
