import { Localized } from '@fluent/react'
import { write } from '@jeswr/pretty-turtle/dist'
import { Suspense, useContext, useEffect, useMemo, useState } from 'react'
import { fetchContext } from '../core/fetchContext'
import LanguageProvider from '../core/language-context'
import { MainContext, MainContextInput, MainContextProvider, initContext } from '../core/main-context'
import ValidationContextProvider from '../core/validation/validation-context'
import { cleanUpDataset } from '../helpers/cleanUpDataset'
import { wrapPromise } from '../helpers/wrapPromise'
import LanguageAwareTabs from './language/LanguageAwareTabs'
import NodeShape from './NodeShape'
import ActionPicker from './various/ActionPicker'
export * from '../core/namespaces'

export type ShaclRendererProps = MainContextInput

function ShaclRendererInner(props: ShaclRendererProps & { contextResource: any }) {
  const givenContext: MainContext = props.contextResource.read()

  const [context, setContext] = useState(givenContext)

  const [, setCounter] = useState(0)

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
          <ActionPicker setContext={setContext} />
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

export default function ShaclRenderer(props: ShaclRendererProps) {
  const { fetch } = useContext(fetchContext)
  const contextResource = useMemo(() => wrapPromise(initContext({ ...props, fetch })), [])

  return (
    <div data-mode={props.mode} className="shacl-renderer">
      <Suspense>
        <ShaclRendererInner contextResource={contextResource} {...props} />
      </Suspense>
    </div>
  )
}
