import type { Term } from '@rdfjs/types'
import type { Grapoi } from 'grapoi'
import { Suspense, useContext, useEffect, useState } from 'react'
import { mainContext } from '../../core/main-context'
import { dash, rdf, sh } from '../../core/namespaces'
import { TouchableTerm } from '../../helpers/touchableRdf'
import { AdditionalWidgetConfiguration } from '../../widgets/widgets-context'
import Icon from '../various/Icon'
import AddNestedNodeButton from './AddNestedNodeButton'
import EditNestedNodeButton from './EditNestedNodeButton'
import { useWidget } from './PropertyShapeEditMode'

export type PropertyObjectEditModeProps = {
  property: Grapoi
  data: Grapoi
  facetSearchData: Grapoi
  items: Grapoi
  errors?: string[]
  deleteTerm: () => void
  isList: boolean
  index: number
  setTerm: (term: Term) => void
  alwaysShowRemove?: true
  rerenderAfterManipulatingPointer: () => void
}

export default function PropertyObjectEditMode(props: PropertyObjectEditModeProps) {
  const { data, items, errors, setTerm, deleteTerm, alwaysShowRemove } = props
  let property = props.property
  const { update, fallback } = useContext(mainContext)

  const widgetItem = useWidget()(property, items)
  const [widgetConfiguration, setWidgetConfiguration] = useState<AdditionalWidgetConfiguration>()
  const [isDeleting, setIsDeleting] = useState(false)
  if (!widgetItem) return null

  const pointer = data.node(data.term)
  const valueClasses = pointer.out(rdf('type')).terms
  const shapes = valueClasses
    .map(valueClass => property.node().hasOut(sh('targetClass'), valueClass))
    .filter(pointer => !pointer.hasOut(dash('abstract')).term)
  const shape = shapes?.[0]?.term

  const showNestedNodeEditButton = shape && !widgetItem?.meta.iri.equals(dash('DetailsEditor')) && props.data.term.value
  const showNestedNodeCreateButton =
    shape && !widgetItem?.meta.iri.equals(dash('DetailsEditor')) && property.out(sh('node')).term

  const minCount = property.out(sh('minCount')).value ? parseInt(property.out(sh('minCount')).value.toString()) : 0
  const itemIsRequired = items.ptrs.length <= minCount

  const onAnimationEnd = isDeleting
    ? () => {
        deleteTerm()
        setIsDeleting(false)
        update() // We need this here so that the drawer group is able to re-render and remove empty fields.
      }
    : undefined

  const cssType = widgetItem.meta.iri.value.split(/\#|\//g).pop()?.replace('Editor', '').toLocaleLowerCase()
  const configuration: AdditionalWidgetConfiguration = widgetConfiguration ?? {}
  const shouldRender = configuration.displayCriteria ? configuration.displayCriteria(data.term, props.index) : true

  return (
    <>
      {props.index === 0 && configuration.header ? (
        <div className={`editor-header ${cssType}`}>{configuration.header()}</div>
      ) : null}
      {shouldRender ? (
        <div
          onAnimationEnd={onAnimationEnd}
          className={`editor ${cssType} ${isDeleting ? 'delete-animation' : ''} ${
            errors?.length ? 'has-error' : ''
          }`.trim()}
        >
          {props.isList ? (
            <div className="sort-handle">
              <Icon icon="mdi:drag" />
            </div>
          ) : null}
          <Suspense fallback={fallback}>
            <widgetItem.Component
              {...props}
              term={data.term}
              useConfigureWidget={(hook: any) => {
                useEffect(() => {
                  setWidgetConfiguration(() => hook)
                }, [])
              }}
              setTerm={setTerm}
            />
          </Suspense>

          {showNestedNodeEditButton ? (
            <>
              <EditNestedNodeButton {...props} shapeIri={shape}>
                {onClick => (
                  <button className="button icon" key={`edit-resource:${shape.value}`} onClick={onClick}>
                    <Icon icon="fluent:document-edit-16-regular" />
                  </button>
                )}
              </EditNestedNodeButton>
            </>
          ) : null}

          {showNestedNodeCreateButton ? (
            <AddNestedNodeButton {...props} shapeIri={shape}>
              {onClick => (
                <button className="button icon" key={`create-resource:${shape.value}`} onClick={onClick}>
                  <Icon icon="fluent:document-add-48-regular" />
                </button>
              )}
            </AddNestedNodeButton>
          ) : null}

          {alwaysShowRemove || (!itemIsRequired && items.ptrs.length > 0 && data.term.value) || errors?.length ? (
            <button
              className="button icon remove-object"
              onClick={async () => {
                if (configuration.deletionCriteria) {
                  const shouldBeDeleted = await configuration.deletionCriteria(data.term)
                  if (shouldBeDeleted) setIsDeleting(true)
                } else {
                  setIsDeleting(true)
                }
              }}
            >
              <Icon icon="mynaui:trash" />
            </button>
          ) : null}

          {errors?.length && (data.term as TouchableTerm).touched !== false ? (
            <span className="errors" dangerouslySetInnerHTML={{ __html: errors.join('\n') }}></span>
          ) : null}
        </div>
      ) : (
        false
      )}
    </>
  )
}
