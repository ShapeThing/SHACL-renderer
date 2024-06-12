import { Icon } from '@iconify/react'
import { Suspense, use, useState } from 'react'
import { Fragment } from 'react/jsx-runtime'
import { dash } from '../../core/namespaces'
import { scoreWidgets } from '../../core/scoreWidgets'
import { widgetsContext } from '../../widgets/widgets-context'
import PropertyObjectEditMode from '../EditMode/PropertyObjectEditMode'

type PropertyObjectInlineEditModeProps = {
  property: GrapoiPointer
  data: GrapoiPointer
}

export default function PropertyObjectInlineEditMode({ data, property }: PropertyObjectInlineEditModeProps) {
  const [mode, setMode] = useState<'view' | 'edit'>('view')
  const { viewers, editors } = use(widgetsContext)

  const viewerWidgetItem = scoreWidgets(viewers, data, property, dash('viewer'))
  const editorWidgetItem = scoreWidgets(editors, data, property, dash('editor'))

  if (!viewerWidgetItem || !editorWidgetItem) return null

  return mode === 'edit' ? (
    <Fragment key={data.term.value}>
      <Suspense fallback={'Loading...'}>
        <PropertyObjectEditMode data={data} property={property} />
        <button onClick={() => setMode('view')}>
          <Icon icon="iconoir:check" />
        </button>
      </Suspense>
    </Fragment>
  ) : (
    <>
      <viewerWidgetItem.Component term={data.term} data={data} property={property} />
      <button onClick={() => setMode(mode === 'view' ? 'edit' : 'view')}>
        <Icon icon="iconoir:edit-pencil" />
      </button>
    </>
  )
}
