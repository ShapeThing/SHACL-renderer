import { Suspense } from 'react'
import { MainContextInput, MainContextProvider, initContext } from '../core/main-context'
import { rdf, sh } from '../core/namespaces'
import ValidationContextProvider from '../core/validation-context'
import { createCidFromProps } from '../helpers/createCidFromProps'
import { wrapPromise } from '../helpers/wrapPromise'
import LanguageAwareTabs from './LanguageAwareTabs'
import NodeShape from './NodeShape'
import ShapePicker from './ShapePicker'
export * from '../core/namespaces'

export type ShaclRendererProps = MainContextInput

const cache = new Map()

function ShaclRendererInner(props: ShaclRendererProps) {
  const cid = createCidFromProps(props)

  if (!cache.has(cid)) {
    cache.set(cid, wrapPromise(initContext(props)))
  }
  const context = cache.get(cid).read()

  const shapePointers = context.shapesPointer.hasOut(rdf('type'), sh('NodeShape'))
  const showShapePicker = shapePointers.terms.length > 1 && !context.targetClass
  return (
    <MainContextProvider context={context}>
      <ValidationContextProvider>
        <div data-mode={context.mode} className="shacl-renderer">
          <LanguageAwareTabs>
            {showShapePicker && !['data', 'type'].includes(context.mode) ? <ShapePicker /> : null}
            <NodeShape {...context} key="root" />
          </LanguageAwareTabs>
        </div>
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
