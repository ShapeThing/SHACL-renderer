import { Localized } from '@fluent/react'
import factory from '@rdfjs/data-model'
import { NamedNode, Term } from '@rdfjs/types'
import { ReactNode, useContext, useState } from 'react'
import { createPortal } from 'react-dom'
import { mainContext } from '../../core/main-context'
import ShaclRenderer from '../ShaclRenderer'

export default function AddNestedNodeButton({
  shapeIri,
  setTerm,
  children
}: {
  shapeIri: NamedNode
  setTerm?: (term: Term) => void
  children: (onClick: () => void) => ReactNode
}) {
  const { originalInput, data: dataset, jsonLdContext, update } = useContext(mainContext)
  const [open, setOpen] = useState(false)

  return (
    <>
      {children(() => setOpen(true))}
      {open
        ? createPortal(
            <dialog className="popup-editor" ref={element => element?.showModal()}>
              <ShaclRenderer
                key={shapeIri?.value}
                {...originalInput}
                prefixes={jsonLdContext.getContextRaw()}
                data={undefined}
                useHierarchy={false}
                subject={factory.blankNode()}
                shapeSubject={shapeIri.value}
                onSubmit={(innerDataset, _prefixes, _dataPointer, context) => {
                  for (const quad of [...innerDataset]) dataset.add(quad)
                  if (setTerm) setTerm(context.subject)
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
