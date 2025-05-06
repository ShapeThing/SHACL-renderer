import { Localized } from '@fluent/react'
import { NamedNode } from '@rdfjs/types'
import { ReactNode, useContext, useState } from 'react'
import { createPortal } from 'react-dom'
import { mainContext } from '../../core/main-context'
import Grapoi from '../../Grapoi'
import ShaclRenderer from '../ShaclRenderer'

export default function EditNestedNodeButton({
  data,
  shapeIri,
  children
}: {
  shapeIri: NamedNode
  data: Grapoi
  children: (onClick: () => void) => ReactNode
}) {
  const [open, setOpen] = useState(false)

  const { originalInput, data: dataset, jsonLdContext, update } = useContext(mainContext)
  if (!['BlankNode', 'NamedNode'].includes(data.term.termType)) return null

  return (
    <>
      {children(() => setOpen(true))}
      {open
        ? createPortal(
            <dialog className="popup-editor" ref={element => element?.showModal()}>
              <ShaclRenderer
                key={'nested:' + shapeIri.value}
                {...originalInput}
                prefixes={jsonLdContext.getContextRaw()}
                data={dataset}
                subject={data.term}
                useHierarchy={false}
                shapeSubject={shapeIri.value}
                onSubmit={() => {
                  setOpen(false)
                  update()
                  setTimeout(update, 200)
                  setTimeout(update, 1000)
                }}
              >
                {submit => {
                  return (
                    <>
                      <button onClick={submit} className="button primary">
                        <Localized id="save">Save</Localized>
                      </button>

                      <button className="secondary button outline" onClick={() => setOpen(false)}>
                        <Localized id="cancel">Cancel</Localized>
                      </button>
                      <button
                        className="danger button outline delete-resource"
                        onClick={() => {
                          setOpen(false)
                        }}
                      >
                        <Localized id="delete">Delete</Localized>
                      </button>
                    </>
                  )
                }}
              </ShaclRenderer>
            </dialog>,

            document.body
          )
        : null}
    </>
  )
}
