import { Grapoi } from 'grapoi'
import { sh } from '../core/namespaces'

export const sortShaclItems = (a: Grapoi, b: Grapoi) =>
  parseInt(a.out(sh('order')).value) - parseInt(b.out(sh('order')).value)
