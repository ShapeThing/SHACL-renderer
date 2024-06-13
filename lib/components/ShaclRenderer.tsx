import '@fontsource/roboto/latin-400.css'
import { useEffect, useState } from 'react'
import { MainContext, MainContextInput, MainContextProvider, initContext } from '../core/main-context'
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
      <NodeShape
        shapePointer={mainContext.shapePointer}
        dataPointer={mainContext.dataPointer}
        facetSearchDataPointer={mainContext.facetSearchDataPointer}
        key="root"
      />
    </MainContextProvider>
  ) : null
}
