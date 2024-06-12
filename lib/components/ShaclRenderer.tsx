import '@fontsource/roboto/latin-400.css'
import { useEffect, useState } from 'react'
import { MainContext, MainContextInput, MainContextProvider, initContext } from '../core/main-context'
import { validationContext } from '../core/validation-context'
import '../scss/style.scss'
import NodeShape from './NodeShape'
export * from '../core/namespaces'

export type ShaclRendererProps = MainContextInput

export default function ShaclRenderer(props: ShaclRendererProps) {
  const [mainContext, setMainContext] = useState<MainContext | undefined>(undefined)

  useEffect(() => {
    initContext(props).then(setMainContext)
  }, [])

  return mainContext ? (
    <MainContextProvider context={mainContext}>
      <validationContext.Provider value={undefined}>
        <NodeShape key="root" />
      </validationContext.Provider>
    </MainContextProvider>
  ) : null
}
