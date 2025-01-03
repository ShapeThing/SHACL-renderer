import { Localized } from '@fluent/react'
import { Icon } from '@iconify-icon/react/dist/iconify.mjs'
import factory from '@rdfjs/data-model'
import { BlankNode, NamedNode } from '@rdfjs/types'
import { ReactNode, useContext, useState } from 'react'
import { createPortal } from 'react-dom'
import { mainContext } from '../../core/main-context'
import { dash, rdf, sh } from '../../core/namespaces'
import ShaclRenderer from '../ShaclRenderer'
import { PropertyObjectEditModeProps } from './PropertyObjectEditMode'

export default function AdditionalButtons({ property, data }: PropertyObjectEditModeProps) {
  const [popupResource, setPopupResource] = useState<NamedNode | BlankNode>()
  const [shapeSubject, setShapeSubject] = useState<NamedNode>()

  const { originalInput, data: dataset } = useContext(mainContext)
  const buttons: ReactNode[] = []

  if (['BlankNode', 'NamedNode'].includes(data.term.termType)) {
    const pointer = data.node(data.term)
    const valueClasses = pointer.out(rdf('type')).terms
    const shapes = valueClasses
      .map(valueClass => property.node().hasOut(sh('targetClass'), valueClass))
      .filter(pointer => !pointer.hasOut(dash('abstract')).term)

    if (shapes.length) {
      buttons.push(
        <button
          className="button icon"
          key="edit-resource"
          onClick={() => {
            setPopupResource(data.term)
            if (shapes[0]?.term) setShapeSubject(shapes[0].term)
          }}
        >
          <Icon icon="fluent:document-edit-16-regular" />
        </button>
      )
    }
  }

  const shClass = property.out(sh('class')).term

  if (shClass && !data.term.value) {
    const shape = property.node().hasOut(sh('targetClass'), shClass)
    if (shape.term) {
      buttons.push(
        <button
          className="button icon"
          key="edit-resource"
          onClick={() => {
            setShapeSubject(shape.term)
          }}
        >
          <Icon icon="fluent:document-add-48-regular" />
        </button>
      )
    }
  }

  return (
    <>
      {popupResource || shapeSubject
        ? createPortal(
            <dialog className="popup-editor" ref={element => element?.showModal()}>
              <ShaclRenderer
                key={popupResource?.value + ':' + shapeSubject?.value}
                {...originalInput}
                data={dataset}
                // data={popupResource?.value ? originalInput.data : undefined}
                // languageMode="individual"
                subject={popupResource ?? factory.blankNode()}
                shapeSubject={shapeSubject?.value}
              >
                {submit => {
                  return (
                    <>
                      <button onClick={submit} className="button primary">
                        <Localized id="save">Save</Localized>
                      </button>

                      <button
                        className="secondary button outline"
                        onClick={() => {
                          setPopupResource(undefined)
                          setShapeSubject(undefined)
                        }}
                      >
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
      {buttons}
    </>
  )
}
