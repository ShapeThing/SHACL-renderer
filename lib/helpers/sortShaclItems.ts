import { sh } from '../core/namespaces'

export const sortShaclItems = (a: GrapoiPointer, b: GrapoiPointer) => (a.out(sh('order')).value as number) - (b.out(sh('order')).value as number)