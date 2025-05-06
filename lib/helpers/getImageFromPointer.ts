import Grapoi from '../Grapoi'
import { getPurposePredicates } from './getPurposePredicates'

export const getImageFromPointer = (pointer?: Grapoi, property?: Grapoi) => {
  // Try to do things the right way.
  if (property) {
    const imagePredicates = getPurposePredicates(property, 'image')
    if (pointer && imagePredicates.length && pointer.out(imagePredicates).values[0]) {
      return pointer.out(imagePredicates).values[0]
    }
  }

  // Fallback to show any image.
  return pointer
    ?.out()
    ?.values.find(value => ['jpg', 'png', 'jpeg', 'gif', 'webm'].some(extension => value.includes(extension)))
}
