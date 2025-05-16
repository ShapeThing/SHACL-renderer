import { createContext, ReactNode, useContext, useEffect, useReducer, useState } from 'react'
import { mainContext } from '../core/main-context'

import { clone, MeldClone, uuid } from '@m-ld/m-ld'
import { IoRemotes } from '@m-ld/m-ld/ext/socket.io'
import dataFactory from '@rdfjs/data-model'
import { Quad } from '@rdfjs/types'
import { MemoryLevel } from 'memory-level'

import { debounce } from 'lodash-es'

export const mldContext = createContext<{ active: boolean; model: MeldClone | undefined }>({
  active: false,
  model: false as any
})

export function useMld() {
  return useContext(mldContext)
}

export default function MldContextProvider({
  children,
  id,
  genesis
}: {
  children: ReactNode
  id?: string
  genesis?: boolean
}) {
  if (!id) return children

  const loadedMainContext = useContext(mainContext)
  const { data } = loadedMainContext
  const [model, setModel] = useState<MeldClone>()
  const [ready, setReady] = useState(false)
  const [, originalRerender] = useReducer(x => x + 1, 0)
  const rerender = debounce(originalRerender, 300)

  async function initMld(id: string, genesis: boolean) {
    const mldClone = await clone(new MemoryLevel(), IoRemotes, {
      '@id': uuid(),
      '@domain': `${id}.public.gw.m-ld.org`,
      genesis,
      /** @ts-ignore */
      io: { uri: 'https://gw.m-ld.org' }
    })

    const unproxiedStore = loadedMainContext.data

    loadedMainContext.data = new Proxy(unproxiedStore, {
      get(target, p, receiver) {
        const result = Reflect.get(target, p, receiver)

        if (p === 'add') {
          return function addQuad(...args: any[]) {
            if (args[0].termType === 'Quad') {
              mldClone.updateQuads({
                insert: args
              })
            } else {
              throw new Error('Unexpected')
            }
            return result.apply(unproxiedStore, args)
          }
        }

        if (p === 'delete') {
          return function deleteQuad(...args: any[]) {
            if (args[0].termType === 'Quad') {
              mldClone.updateQuads({
                delete: args
              })
            } else {
              throw new Error('Unexpected')
            }
            return result.apply(unproxiedStore, args)
          }
        }

        return result
      }
    })

    await mldClone.status.becomes({ outdated: false })

    if (genesis) {
      const dataToSend = [...data].map(triple => {
        let { subject, predicate, object } = triple

        if (subject.termType === 'BlankNode')
          subject = dataFactory.namedNode(`https://shacl-renderer.shapething.com/.well-known/genid/${subject.value}`)
        if (object.termType === 'BlankNode')
          object = dataFactory.namedNode(`https://shacl-renderer.shapething.com/.well-known/genid/${object.value}`)

        return dataFactory.quad(subject, predicate, object)
      })
      await mldClone.updateQuads({
        insert: dataToSend
      })
    }

    ;(async () => {
      for await (const [update] of mldClone.follow()) {
        console.log('update incoming', update)
        /** @ts-ignore */
        const deletions: Quad[] = update['@delete']._quads
        for (const quad of deletions) unproxiedStore.delete(quad)

        /** @ts-ignore */
        const additions: Quad[] = update['@insert']._quads
        for (const quad of additions) unproxiedStore.add(quad)

        rerender()
      }
    })()

    const stream = mldClone.match()
    const quads = [...data]
    for (const quad of quads) data.delete(quad)
    stream.on('data', quad => {
      data.add(quad)
    })
    stream.on('end', () => {
      console.log('done')
      rerender()
    })

    setModel(mldClone)
    setReady(true)
  }

  useEffect(() => {
    initMld(id, !!genesis)
  }, [])

  return <mldContext.Provider value={{ active: true, model }}>{ready ? children : null}</mldContext.Provider>
}
