import debounce from 'lodash-es/debounce'
import { useMemo } from 'react'

export function useDebounced<T extends (...args: any) => any>(
  callback: T,
  dependencies: any[] = [],
  time: number = 200
) {
  return useMemo(() => debounce(callback, time), dependencies)
}
