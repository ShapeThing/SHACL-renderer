import { Localized } from '@fluent/react'
import datasetFactory from '@rdfjs/dataset'
import { NamedNode } from '@rdfjs/types'
import { Grapoi } from 'grapoi'
import { useContext, useState } from 'react'
import { createPortal } from 'react-dom'
import { mainContext } from '../../core/main-context'
import { outAll } from '../../helpers/outAll'
import ShaclRenderer from '../ShaclRenderer'
import Icon from '../various/Icon'

export default function EditNestedNodeButton({ data, shapeIri }: { shapeIri: NamedNode; data: Grapoi }) {
  const [open, setOpen] = useState(false)

  const { originalInput, data: dataset, jsonLdContext, update } = useContext(mainContext)
  if (!['BlankNode', 'NamedNode'].includes(data.term.termType)) return null

  return (
    <>
      <button className="button icon" key={`edit-resource:${shapeIri.value}`} onClick={() => setOpen(true)}>
        <Icon icon="fluent:document-edit-16-regular" />
      </button>

      {open
        ? createPortal(
            <dialog className="popup-editor" ref={element => element?.showModal()}>
              <ShaclRenderer
                key={'nested:' + shapeIri.value}
                {...originalInput}
                prefixes={jsonLdContext.getContextRaw()}
                data={datasetFactory.dataset(outAll(data))}
                subject={data.term}
                useHierarchy={false}
                shapeSubject={shapeIri.value}
                onSubmit={localDataset => {
                  const localQuads = [...localDataset]
                  const initialQuads = outAll(data)

                  const deletions = initialQuads.filter(
                    initialQuad => !localQuads.some(localQuad => localQuad.equals(initialQuad))
                  )
                  const additions = localQuads.filter(
                    localQuad => !initialQuads.some(initialQuad => localQuad.equals(initialQuad))
                  )
                  for (const deletion of deletions) dataset.delete(deletion)
                  for (const addition of additions) dataset.add(addition)
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
