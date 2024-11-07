import { Icon } from '@iconify-icon/react'
import type { Term } from '@rdfjs/types'
import type { Grapoi } from 'grapoi'
import { useContext, useState } from 'react'
import { dash, sh } from '../../core/namespaces'
import { scoreWidgets } from '../../core/scoreWidgets'
import { widgetsContext } from '../../widgets/widgets-context'

type PropertyObjectEditModeProps = {
  property: Grapoi
  data: Grapoi
  facetSearchData: Grapoi
  items: Grapoi
  errors?: string[]
  deleteTerm: () => void
  index: number
  setTerm: (term: Term) => void
  rerenderAfterManipulatingPointer: () => void
}

export default function PropertyObjectEditMode(props: PropertyObjectEditModeProps) {
  const { data, property, items, errors, setTerm, deleteTerm } = props
  const { editors } = useContext(widgetsContext)
  const widgetItem = scoreWidgets(editors, data, property, dash('editor'))
  const [isDeleting, setIsDeleting] = useState(false)
  if (!widgetItem) {
    return null
  }

  const minCount = property.out(sh('minCount')).value ? parseInt(property.out(sh('minCount')).value.toString()) : 0
  const itemIsRequired = items.ptrs.length <= minCount

  const onAnimationEnd = isDeleting
    ? () => {
        deleteTerm()
        setIsDeleting(false)
      }
    : undefined

  const cssType = widgetItem.meta.iri.value.split(/\#|\//g).pop()?.replace('Editor', '').toLocaleLowerCase()

  const shouldRender = widgetItem.meta.shouldDisplay ? widgetItem.meta.shouldDisplay(data.term, props.index) : true

  return shouldRender ? (
    <div
      onAnimationEnd={onAnimationEnd}
      className={`editor ${cssType} ${isDeleting ? 'delete-animation' : ''} ${
        errors?.length ? 'has-error' : ''
      }`.trim()}
    >
      <widgetItem.Component {...props} term={data.term} setTerm={setTerm} />
      {!itemIsRequired || errors?.length ? (
        <button className="button icon remove-object" onClick={() => setIsDeleting(true)}>
          <Icon icon="mynaui:trash" />
        </button>
      ) : null}

      {errors?.length ? <span className="errors" dangerouslySetInnerHTML={{ __html: errors.join('\n') }}></span> : null}
    </div>
  ) : (
    false
  )
}
