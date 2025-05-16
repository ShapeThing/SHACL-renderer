import { createContext } from 'react'

import { NamedNode, Quad_Subject } from '@rdfjs/types'
import Grapoi from '../../Grapoi'
import { GrapoiWithId } from './SortableStore'

type Props = {
  getItems: (parent?: Quad_Subject) => GrapoiWithId[]
  setItems: (items: Grapoi[]) => void
  itemIsGroup: (item: Grapoi) => boolean
  labelPredicates?: NamedNode[]
}

const noop = () => {
  throw new Error('Please implement')
}

export const sortableStoreContext = createContext<Props>({
  getItems: noop,
  setItems: noop,
  itemIsGroup: noop,
  labelPredicates: []
})
