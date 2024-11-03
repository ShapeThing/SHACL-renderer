import { debounce } from 'lodash-es'
import { useCallback, useRef } from 'react'

export function useDebounced<T extends (...args: any) => any>(
  callback: T,
  dependencies: any[] = [],
  time: number = 200
) {
  const callbackDebounced = useRef(debounce(callback, time))
  return useCallback((...args: Parameters<T>) => {
    console.log(args[0])
    return callbackDebounced.current(...args)
  }, dependencies)
}
