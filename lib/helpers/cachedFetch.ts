import { D2LFetch } from 'd2l-fetch'
import { fetchDedupe } from 'd2l-fetch-dedupe'
import { D2LFetchSimpleCache } from 'd2l-fetch-simple-cache/src/d2lfetch-simple-cache.js'

export const cachedFetch = (): (typeof globalThis)['fetch'] => {
  const simpleCache = new D2LFetchSimpleCache()
  function fetchSimpleCache(...args: unknown[]) {
    return simpleCache.cache(...args)
  }

  const d2LFetch = new D2LFetch()
  d2LFetch.use({ name: 'simple-cache', fn: fetchSimpleCache })
  d2LFetch.use({ name: 'dedupe', fn: fetchDedupe })
  return (input: RequestInfo | URL, init?: RequestInit | undefined): ReturnType<(typeof globalThis)['fetch']> => {
    if (input instanceof URL) input = input.toString()
    if (input.toString().includes('blob:')) return fetch(input, init)
    return d2LFetch.fetch(input, init)
  }
}
