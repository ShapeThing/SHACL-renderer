export function wrapPromise<T extends Promise<unknown>>(promise: T) {
  let status = 'pending'
  let response: Awaited<T>

  const suspender = promise.then(
    res => {
      status = 'success'
      response = res as Awaited<T>
    },
    err => {
      status = 'error'
      response = err
    }
  )
  const read = (): Awaited<T> => {
    switch (status) {
      case 'pending':
        throw suspender
      case 'error':
        throw response
      default:
        return response
    }
  }

  return { read }
}
