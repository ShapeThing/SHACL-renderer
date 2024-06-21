import { DatasetCore } from '@rdfjs/types'

const reRenderMethods = ['add', 'delete']

export const datasetProxy = (dataset: DatasetCore, callback: (property: 'add' | 'delete') => void) => {
  return new Proxy(dataset, {
    get(target, p, receiver) {
      if (reRenderMethods.includes(p.toString())) {
        return (...args: any[]) => {
          const originalMethod = Reflect.get(target, p, receiver)
          const response = originalMethod.apply(target, args)
          callback(p.toString() as 'add' | 'delete')
          return response
        }
      }

      return Reflect.get(target, p, receiver)
    }
  })
}
