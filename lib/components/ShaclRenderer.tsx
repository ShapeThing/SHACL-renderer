import { Suspense } from 'react'
import { MainContextInput, MainContextProvider, initContext } from '../core/main-context'
import ValidationContextProvider from '../core/validation-context'
import { createCidFromProps } from '../helpers/createCidFromProps'
import { wrapPromise } from '../helpers/wrapPromise'
import LanguageAwareTabs from './LanguageAwareTabs'
import NodeShape from './NodeShape'
export * from '../core/namespaces'

export type ShaclRendererProps = MainContextInput

const cache = new Map()

function ShaclRendererInner(props: ShaclRendererProps) {
  const cid = createCidFromProps(props)

  if (!cache.has(cid)) {
    cache.set(cid, wrapPromise(initContext(props)))
  }
  const context = cache.get(cid).read()

  return (
    <MainContextProvider context={context}>
      <ValidationContextProvider>
        <LanguageAwareTabs>
          <NodeShape {...context} key="root" />
        </LanguageAwareTabs>
      </ValidationContextProvider>
    </MainContextProvider>
  )
}

export default function ShaclRenderer(props: ShaclRendererProps) {
  return (
    <Suspense>
      <ShaclRendererInner {...props} />
    </Suspense>
  )
}
