import { Grapoi } from 'grapoi'
import { sh } from '../core/namespaces'

export const sortShaclItems = (a: Grapoi, b: Grapoi) =>
  (a.out(sh('order')).value as number) - (b.out(sh('order')).value as number)
