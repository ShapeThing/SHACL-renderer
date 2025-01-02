import { Localized } from '@fluent/react'
import { Icon } from '@iconify-icon/react/dist/iconify.mjs'
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

  const { originalInput } = useContext(mainContext)
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
          <Icon icon="fluent-mdl2:page-edit" />
        </button>
      )
    }
  }

  return (
    <>
      {popupResource
        ? createPortal(
            <dialog className="popup-editor" ref={element => element?.showModal()}>
              <ShaclRenderer
                {...originalInput}
                // languageMode="individual"
                subject={popupResource}
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
