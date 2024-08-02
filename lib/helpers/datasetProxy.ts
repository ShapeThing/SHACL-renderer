import { DatasetCore } from '@rdfjs/types'
import { TouchableQuad } from './touchableRdf'

const reRenderMethods = ['add', 'delete']

export const datasetProxy = (dataset: DatasetCore, callback: (property: 'add' | 'delete') => void) => {
  return new Proxy(dataset, {
    get(target, p, receiver) {
      if (p === 'isProxy') return true

      if (reRenderMethods.includes(p.toString())) {
        return (quad: TouchableQuad) => {
          const originalMethod = Reflect.get(target, p, receiver)
          const response = originalMethod.apply(target, [quad])
          // const untouched =
          //   quad.subject.touched === false || quad.predicate.touched === false || quad.object.touched === false
          // // if (!untouched)
          // // Negative consequence
          if (!quad.object.skipCallback) callback(p.toString() as 'add' | 'delete')
          return response
        }
      }

      return Reflect.get(target, p, receiver)
    }
  })
}
