import type { Term } from '@rdfjs/types'
import type { Grapoi } from 'grapoi'
import { Suspense, useContext, useEffect, useState } from 'react'
import { dash, sh } from '../../core/namespaces'
import { scoreWidgets } from '../../core/scoreWidgets'
import { TouchableTerm } from '../../helpers/touchableRdf'
import { AdditionalWidgetConfiguration, widgetsContext } from '../../widgets/widgets-context'
import Icon from '../various/Icon'
import AdditionalButtons from './AdditionalButtons'

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
  const { editors } = useContext(widgetsContext)

  const widgetItem = scoreWidgets(editors, data, property, dash('editor'))
  const [widgetConfiguration, setWidgetConfiguration] = useState<AdditionalWidgetConfiguration>()
  const [isDeleting, setIsDeleting] = useState(false)
  if (!widgetItem) return null

  const minCount = property.out(sh('minCount')).value ? parseInt(property.out(sh('minCount')).value.toString()) : 0
  const itemIsRequired = items.ptrs.length <= minCount

  const onAnimationEnd = isDeleting
    ? () => {
        deleteTerm()
        setIsDeleting(false)
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
          <Suspense>
            <widgetItem.Component
              {...props}
              term={data.term}
              useConfigureWidget={hook => {
                useEffect(() => {
                  setWidgetConfiguration(() => hook)
                }, [])
              }}
              setTerm={setTerm}
            />
          </Suspense>
          <AdditionalButtons {...props} setTerm={setTerm} widgetItem={widgetItem} />
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
