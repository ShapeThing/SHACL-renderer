import { debounce } from 'lodash-es'
import { useCallback, useRef } from 'react'

export function useDebounced<T extends (...args: unknown[]) => Promise<T>>(
  callback: T,
  dependencies: unknown[] = [],
  time: number = 200
) {
  const callbackDebounced = useRef(debounce(callback, time))
  return useCallback((...args: Parameters<T>) => {
    return callbackDebounced.current(...args)
  }, dependencies)
}
