import { Localized } from '@fluent/react'
import factory from '@rdfjs/data-model'
import { useContext, useState } from 'react'
import { createPortal } from 'react-dom'
import { mainContext } from '../../core/main-context'
import { dash, sh } from '../../core/namespaces'
import { WidgetItem } from '../../widgets/widgets-context'
import ShaclRenderer from '../ShaclRenderer'
import Icon from '../various/Icon'
import { PropertyObjectEditModeProps } from './PropertyObjectEditMode'

export default function AddNestedNodeButton({
  property,
  data,
  setTerm,
  widgetItem
}: PropertyObjectEditModeProps & { widgetItem: WidgetItem }) {
  const { originalInput, data: dataset, jsonLdContext, update } = useContext(mainContext)
  const [open, setOpen] = useState(false)
  const shClass = property.out(sh('class')).term

  if (!shClass || data.term.value) return null
  const shape = property.node().hasOut(sh('targetClass'), shClass)
  if (!shape.term || widgetItem.meta.iri.equals(dash('DetailsEditor'))) return null

  return (
    <>
      <button className="button icon" key={`create-resource:${shape.term.value}`} onClick={() => setOpen(true)}>
        <Icon icon="fluent:document-add-48-regular" />
      </button>
      {open
        ? createPortal(
            <dialog className="popup-editor" ref={element => element?.showModal()}>
              <ShaclRenderer
                key={shape?.value}
                {...originalInput}
                prefixes={jsonLdContext.getContextRaw()}
                data={undefined}
                subject={factory.blankNode()}
                shapeSubject={shape.term.value}
                onSubmit={(innerDataset, _prefixes, _dataPointer, context) => {
                  for (const quad of [...innerDataset]) dataset.add(quad)
                  setTerm(context.subject)
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
