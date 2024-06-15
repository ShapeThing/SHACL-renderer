import '@fontsource/roboto/latin-400.css'
import { Suspense } from 'react'
import useSWR from 'swr'
import { MainContextInput, MainContextProvider, initContext } from '../core/main-context'
import '../scss/style.scss'
import NodeShape from './NodeShape'
export * from '../core/namespaces'

export type ShaclRendererProps = MainContextInput

function ShaclRendererInner(props: ShaclRendererProps) {
  const { data: context } = useSWR('context', () => initContext(props), {
    suspense: true
  })

  return (
    <MainContextProvider context={context}>
      <NodeShape {...context} key="root" />
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
