import { write } from '@jeswr/pretty-turtle/dist'
import datasetFactory from '@rdfjs/dataset'
import { Suspense } from 'react'
import { MainContext, MainContextInput, MainContextProvider, initContext } from '../core/main-context'
import { rdf, sh } from '../core/namespaces'
import ValidationContextProvider from '../core/validation-context'
import { createCidFromProps } from '../helpers/createCidFromProps'
import { TouchableTerm } from '../helpers/touchableRdf'
import { wrapPromise } from '../helpers/wrapPromise'
import LanguageAwareTabs from './LanguageAwareTabs'
import NodeShape from './NodeShape'
import ShapePicker from './ShapePicker'
export * from '../core/namespaces'

export type ShaclRendererProps = MainContextInput

const cache = new Map()

function ShaclRendererInner(props: ShaclRendererProps) {
  const cid = createCidFromProps(props)
  if (!cache.has(cid)) cache.set(cid, wrapPromise(initContext(props)))
  const context: MainContext = cache.get(cid).read()

  const shapePointers = context.shapesPointer.hasOut(rdf('type'), sh('NodeShape'))
  const showShapePicker = shapePointers.terms.length > 1 && !context.targetClass

  const submit = async () => {
    const finalDataset = datasetFactory.dataset(
      [...context.data].filter(quad => (quad.object as TouchableTerm).touched !== false)
    )

    if (props.onSubmit) {
      props.onSubmit(finalDataset, context.jsonLdContext.getContextRaw())
    }
    // For now this is helpful for debugging.
    else {
      const turtle = await write([...finalDataset], {
        prefixes: context.jsonLdContext.getContextRaw()
      })
      console.log(turtle)
    }
  }

  return (
    <MainContextProvider context={context}>
      <ValidationContextProvider>
        <LanguageAwareTabs>
          {showShapePicker ? <ShapePicker /> : null}
          <NodeShape {...context} key="root" />
          <div className="actions">
            {props.children ? (
              props.children(submit)
            ) : ['edit', 'inline-edit'].includes(context.mode) ? (
              <button onClick={submit} className="button primary">
                Save
              </button>
            ) : null}
          </div>
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
