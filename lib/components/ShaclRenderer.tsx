import { Suspense } from 'react'
import { MainContextInput, MainContextProvider } from '../core/main-context'
import { validationContext } from '../core/validation-context'
import NodeShape from './NodeShape'
export * from '../core/namespaces'

export type ShaclRendererProps = MainContextInput

export default function ShaclRenderer(props: ShaclRendererProps) {
  return (
    <Suspense>
      <MainContextProvider {...props}>
        <validationContext.Provider value={undefined}>
          <NodeShape />
        </validationContext.Provider>
      </MainContextProvider>
    </Suspense>
  )
}
