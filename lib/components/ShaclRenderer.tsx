import '@fontsource/roboto/latin-400.css'
import { Suspense, useState } from 'react'
import { MainContextInput, MainContextProvider, initContext } from '../core/main-context'
import { validationContext } from '../core/validation-context'
import '../scss/style.scss'
import NodeShape from './NodeShape'
export * from '../core/namespaces'

export type ShaclRendererProps = MainContextInput

export default function ShaclRenderer(props: ShaclRendererProps) {
  const [mainContext] = useState(() => initContext(props))

  return (
    <Suspense>
      <MainContextProvider contextPromise={mainContext}>
        <validationContext.Provider value={undefined}>
          <NodeShape />
        </validationContext.Provider>
      </MainContextProvider>
    </Suspense>
  )
}
