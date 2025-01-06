import { Localized } from '@fluent/react'
import datasetFactory from '@rdfjs/dataset'
import { useContext, useState } from 'react'
import { createPortal } from 'react-dom'
import { mainContext } from '../../core/main-context'
import { dash, rdf, sh } from '../../core/namespaces'
import { outAll } from '../../helpers/outAll'
import { WidgetItem } from '../../widgets/widgets-context'
import ShaclRenderer from '../ShaclRenderer'
import Icon from '../various/Icon'
import { PropertyObjectEditModeProps } from './PropertyObjectEditMode'

export default function EditNestedNodeButton({
  property,
  data,
  widgetItem
}: PropertyObjectEditModeProps & { widgetItem: WidgetItem }) {
  const [open, setOpen] = useState(false)

  const { originalInput, data: dataset, jsonLdContext, update } = useContext(mainContext)
  if (!['BlankNode', 'NamedNode'].includes(data.term.termType)) return null

  const pointer = data.node(data.term)
  const valueClasses = pointer.out(rdf('type')).terms
  const shapes = valueClasses
    .map(valueClass => property.node().hasOut(sh('targetClass'), valueClass))
    .filter(pointer => !pointer.hasOut(dash('abstract')).term)

  if (!shapes.length || widgetItem.meta.iri.equals(dash('DetailsEditor'))) return null

  return (
    <>
      <button
        className="button icon"
        key={`edit-resource:${shapes.map(shape => shape.term.value).join(',')}`}
        onClick={() => setOpen(true)}
      >
        <Icon icon="fluent:document-edit-16-regular" />
      </button>

      {open
        ? createPortal(
            <dialog className="popup-editor" ref={element => element?.showModal()}>
              <ShaclRenderer
                key={shapes.flatMap(shape => shape.terms).join(',')}
                {...originalInput}
                prefixes={jsonLdContext.getContextRaw()}
                data={datasetFactory.dataset(outAll(data))}
                subject={data.term}
                shapeSubject={shapes[0].term.value}
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
