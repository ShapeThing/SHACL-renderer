import { write } from '@jeswr/pretty-turtle/dist'
import { Suspense } from 'react'
import { MainContext, MainContextInput, MainContextProvider, initContext } from '../core/main-context'
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
  const context: MainContext = cache.get(cid).read()

  const shapePointers = context.shapesPointer.hasOut(rdf('type'), sh('NodeShape'))
  const showShapePicker = shapePointers.terms.length > 1 && !context.targetClass

  return (
    <MainContextProvider context={context}>
      <ValidationContextProvider>
        <LanguageAwareTabs>
          {showShapePicker ? <ShapePicker /> : null}
          <NodeShape {...context} key="root" />
          <button
            onClick={async () => {
              const turtle = await write([...context.dataPointer.ptrs[0].dataset], {
                prefixes: context.jsonLdContext.getContextRaw()
              })
              console.log(turtle)
            }}
            className="button primary"
          >
            Save
          </button>
        </LanguageAwareTabs>
      </ValidationContextProvider>
    </MainContextProvider>
  )
}

export default function ShaclRenderer(props: ShaclRendererProps) {
  return (
    <div data-mode={props.mode} className="shacl-renderer">
      <Suspense>
        <ShaclRendererInner {...props} />
      </Suspense>
    </div>
  )
}
