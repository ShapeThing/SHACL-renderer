import { Term } from '@rdfjs/types'
import { Grapoi } from 'grapoi'
import { useContext, useState } from 'react'
import { Fragment } from 'react/jsx-runtime'
import IconCheck from '~icons/iconoir/check'
import IconEditPencil from '~icons/iconoir/edit-pencil'
import { dash } from '../../core/namespaces'
import { scoreWidgets } from '../../core/scoreWidgets'
import { widgetsContext } from '../../widgets/widgets-context'
import PropertyObjectEditMode from '../EditMode/PropertyObjectEditMode'

type PropertyObjectInlineEditModeProps = {
  property: Grapoi
  data: Grapoi
  items: Grapoi
  facetSearchData: Grapoi
  initialMode?: 'view' | 'edit'
  setTerm: (term: Term) => void
  deleteTerm: () => void
}

export default function PropertyObjectInlineEditMode(props: PropertyObjectInlineEditModeProps) {
  const { data, property } = props
  const [mode, setMode] = useState<'view' | 'edit'>(props.initialMode ?? 'view')
  const { viewers, editors } = useContext(widgetsContext)

  const viewerWidgetItem = scoreWidgets(viewers, data, property, dash('viewer'))
  const editorWidgetItem = scoreWidgets(editors, data, property, dash('editor'))

  if (!viewerWidgetItem || !editorWidgetItem) return null

  return mode === 'edit' ? (
    <Fragment>
      <PropertyObjectEditMode {...props} />
      <button className="inline-button" onClick={() => setMode('view')}>
        <IconCheck />
      </button>
    </Fragment>
  ) : (
    <Fragment>
      <viewerWidgetItem.Component {...props} term={data.term} />
      <button className="inline-button" onClick={() => setMode(mode === 'view' ? 'edit' : 'view')}>
        <IconEditPencil />
      </button>
    </Fragment>
  )
}
