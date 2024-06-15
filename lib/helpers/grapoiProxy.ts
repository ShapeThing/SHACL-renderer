const reRenderMethods = ['addOut', 'addIn']

export const grapoiProxy = (pointer: GrapoiPointer, callback: () => void) => {
  return new Proxy(pointer, {
    get(target, p, receiver) {
      if (reRenderMethods.includes(p.toString())) {
        return (...args: any[]) => {
          const originalMethod = Reflect.get(target, p, receiver)
          const response = originalMethod.apply(target, args)
          callback()
          return response
        }
      }

      return Reflect.get(target, p, receiver)
    }
  })
}
