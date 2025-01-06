import { Localized } from '@fluent/react'
import factory from '@rdfjs/data-model'
import { BlankNode, NamedNode } from '@rdfjs/types'
import { ReactNode, useContext, useState } from 'react'
import { createPortal } from 'react-dom'
import { mainContext } from '../../core/main-context'
import { dash, rdf, sh } from '../../core/namespaces'
import { cleanUpDataset } from '../../helpers/cleanUpDataset'
import { WidgetItem } from '../../widgets/widgets-context'
import ShaclRenderer from '../ShaclRenderer'
import Icon from '../various/Icon'
import { PropertyObjectEditModeProps } from './PropertyObjectEditMode'

export default function AdditionalButtons({
  property,
  data,
  setTerm,
  widgetItem
}: PropertyObjectEditModeProps & { widgetItem: WidgetItem }) {
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

    if (shapes.length && !widgetItem.meta.iri.equals(dash('DetailsEditor'))) {
      buttons.push(
        <button
          className="button icon"
          key={`edit-resource:${shapes.map(shape => shape.term.value).join(',')}`}
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
    if (shape.term && !widgetItem.meta.iri.equals(dash('DetailsEditor'))) {
      buttons.push(
        <button
          className="button icon"
          key={`create-resource:${shape.term.value}`}
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
                subject={popupResource ?? factory.blankNode()}
                shapeSubject={shapeSubject?.value}
                onSubmit={(_data, _prefixes, _dataPointer, context) => {
                  setTerm(context.subject)
                }}
              >
                {submit => {
                  return (
                    <>
                      <button
                        onClick={() => {
                          submit()
                          setPopupResource(undefined)
                          setShapeSubject(undefined)
                          cleanUpDataset(dataset)
                        }}
                        className="button primary"
                      >
                        <Localized id="save">Save</Localized>
                      </button>

                      <button
                        className="secondary button outline"
                        onClick={() => {
                          setPopupResource(undefined)
                          setShapeSubject(undefined)
                          cleanUpDataset(dataset)
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
