import { Localized } from '@fluent/react'
import { write } from '@jeswr/pretty-turtle'
import { Suspense, use, useContext, useEffect, useRef, useState } from 'react'
import { fetchContext } from '../core/fetchContext'
import LanguageProvider from '../core/language-context'
import { initContext, MainContext, MainContextInput } from '../core/main-context'
import ValidationContextProvider from '../core/validation/validation-context'
import { cleanUpDataset } from '../helpers/cleanUpDataset'
import LanguageAwareTabs from './language/LanguageAwareTabs'
import { MainContextProvider } from './MainContextProvider'
import NodeShape from './NodeShape'
import { prefixes } from './ShaclRenderer'
import ActionPicker from './various/ActionPicker'
export * from '../core/namespaces'

export type ShaclRendererProps = MainContextInput

function ShaclRendererInner(props: ShaclRendererProps & { contextResource: any }) {
  const [contextResource, setContextResource] = useState(props.contextResource)
  const context: MainContext = use(contextResource)
  const [, setCounter] = useState(0)

  const submit = async () => {
    cleanUpDataset(context.data)

    if (props.onSubmit) {
      await props.onSubmit(context.data, context.jsonLdContext.getContextRaw(), context.dataPointer, context)
    }
    // For now this is helpful for debugging.
    else {
      const turtle = await write([...context.data], {
        prefixes: {
          ...prefixes,
          ...context.jsonLdContext.getContextRaw()
        }
      })
      console.log(turtle)
    }
  }

  useEffect(() => {
    // TODO migrate over to filter out the untouched terms in the view mode.
    if (!['edit', 'inline-edit'].includes(context.mode)) {
      cleanUpDataset(context.data)
      setCounter(counter => counter + 1)
    }
  }, [context.mode])

  return (
    <MainContextProvider context={context}>
      <LanguageProvider>
        <ValidationContextProvider>
          <ActionPicker setContext={setContextResource} />
          <LanguageAwareTabs>
            <NodeShape key="root" />
            <div className="actions">
              {props.children ? (
                props.children(submit)
              ) : ['edit', 'inline-edit'].includes(context.mode) ? (
                <button onClick={submit} className="button primary big">
                  <Localized id="save">Save</Localized>
                </button>
              ) : null}
            </div>
          </LanguageAwareTabs>
        </ValidationContextProvider>
      </LanguageProvider>
    </MainContextProvider>
  )
}

/**
 * A React component that renders a SHACL shape (if given) as a form, a view or facets
 */
export default function ShaclRenderer(props: ShaclRendererProps) {
  const { fetch } = useContext(fetchContext)
  const contextResource = useRef<Promise<MainContext>>(null)

  const [hasBeenMounted, setHasBeenMounted] = useState(false)
  useEffect(() => {
    if (contextResource.current === null) {
      contextResource.current = initContext({ ...props, fetch })
      setHasBeenMounted(true)
    }
  }, [])

  return hasBeenMounted ? (
    <div data-mode={props.mode} className="shacl-renderer">
      <Suspense fallback={props.fallback}>
        <ShaclRendererInner contextResource={contextResource.current} {...props} />
      </Suspense>
    </div>
  ) : null
}
