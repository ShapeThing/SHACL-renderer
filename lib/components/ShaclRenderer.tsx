import { write } from '@jeswr/pretty-turtle/dist'
import { Suspense, useContext, useEffect, useState } from 'react'
import { fetchContext } from '../core/fetchContext'
import LanguageProvider from '../core/language-context'
import { MainContext, MainContextInput, MainContextProvider, initContext } from '../core/main-context'
import { rdf, sh } from '../core/namespaces'
import ValidationContextProvider from '../core/validation-context'
import { cleanUpDataset } from '../helpers/cleanUpDataset'
import { createCidFromProps } from '../helpers/createCidFromProps'
import { wrapPromise } from '../helpers/wrapPromise'
import InterfaceLanguagePicker from './InterfaceLanguagePicker'
import LanguageAwareTabs from './LanguageAwareTabs'
import NodeShape from './NodeShape'
import ShapePicker from './ShapePicker'
export * from '../core/namespaces'

export type ShaclRendererProps = MainContextInput

function ShaclRendererInner(props: ShaclRendererProps & { contextCache: Map<any, any> }) {
  const { contextCache } = props
  const cid = createCidFromProps(props)
  const { fetch } = useContext(fetchContext)
  if (!contextCache.has(cid)) contextCache.set(cid, wrapPromise(initContext({ ...props, fetch })))
  const context: MainContext = contextCache.get(cid).read()
  const [, setCounter] = useState(0)

  const shapePointers = context.shapesPointer.hasOut(rdf('type'), sh('NodeShape'))
  const showShapePicker = shapePointers.terms.length > 1 && !context.targetClass

  const submit = async () => {
    cleanUpDataset(context.data)

    if (props.onSubmit) {
      await props.onSubmit(context.data, context.jsonLdContext.getContextRaw(), context.dataPointer)
    }
    // For now this is helpful for debugging.
    else {
      const turtle = await write([...context.data], {
        prefixes: context.jsonLdContext.getContextRaw()
      })
      console.log(turtle)
    }
  }

  useEffect(() => {
    if (!['edit', 'inline-edit'].includes(context.mode)) {
      cleanUpDataset(context.data)
      setCounter(counter => counter + 1)
    }
  }, [context.mode])

  return (
    <MainContextProvider context={context}>
      <LanguageProvider
        activeContentLanguage={context.activeContentLanguage}
        activeInterfaceLanguage={context.activeInterfaceLanguage}
      >
        <ValidationContextProvider>
          <InterfaceLanguagePicker />
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
      </LanguageProvider>
    </MainContextProvider>
  )
}

export default function ShaclRenderer(props: ShaclRendererProps) {
  const [contextCache, _setContextCache] = useState(new Map())

  return (
    <div data-mode={props.mode} className="shacl-renderer">
      <Suspense>
        <ShaclRendererInner {...props} contextCache={contextCache} />
      </Suspense>
    </div>
  )
}
