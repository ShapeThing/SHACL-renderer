import '@fontsource/roboto/latin-400.css'
import { Suspense } from 'react'
import useSwrImmutable from 'swr/immutable'
import LanguageProvider from '../core/language-context'
import { MainContextInput, MainContextProvider, initContext } from '../core/main-context'
import ValidationContextProvider from '../core/validation-context'
import { createCidFromProps } from '../helpers/createCidFromProps'
import '../scss/style.scss'
import LanguageAwareTabs from './LanguageAwareTabs'
import NodeShape from './NodeShape'
export * from '../core/namespaces'

export type ShaclRendererProps = MainContextInput

function ShaclRendererInner(props: ShaclRendererProps) {
  const cid = createCidFromProps(props)
  const { data: context } = useSwrImmutable('context-' + cid, () => initContext(props), { suspense: true })

  return (
    <MainContextProvider context={context}>
      <ValidationContextProvider>
        <LanguageProvider>
          <LanguageAwareTabs>
            <NodeShape {...context} key="root" />
          </LanguageAwareTabs>
        </LanguageProvider>
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
