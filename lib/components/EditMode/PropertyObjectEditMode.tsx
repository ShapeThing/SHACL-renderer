import { Icon } from '@iconify-icon/react'
import type { Term } from '@rdfjs/types'
import type { Grapoi } from 'grapoi'
import { useContext, useEffect, useState } from 'react'
import { dash, sh } from '../../core/namespaces'
import { scoreWidgets } from '../../core/scoreWidgets'
import { AdditionalWidgetConfiguration, widgetsContext } from '../../widgets/widgets-context'

type PropertyObjectEditModeProps = {
  property: Grapoi
  data: Grapoi
  facetSearchData: Grapoi
  items: Grapoi
  errors?: string[]
  deleteTerm: () => void
  isList: boolean
  index: number
  setTerm: (term: Term) => void
  rerenderAfterManipulatingPointer: () => void
}

export default function PropertyObjectEditMode(props: PropertyObjectEditModeProps) {
  const { data, property, items, errors, setTerm, deleteTerm } = props
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
          {!itemIsRequired || errors?.length ? (
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

          {errors?.length ? (
            <span className="errors" dangerouslySetInnerHTML={{ __html: errors.join('\n') }}></span>
          ) : null}
        </div>
      ) : (
        false
      )}
    </>
  )
}
