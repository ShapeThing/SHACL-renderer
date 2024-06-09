import { Icon } from '@iconify/react'
import { Suspense, useState } from 'react'
import { Fragment } from 'react/jsx-runtime'
import { getWidget } from '../../core/getWidget'
import PropertyObjectEditMode from '../EditMode/PropertyObjectEditMode'

type PropertyObjectInlineEditModeProps = {
  property: GrapoiPointer
  data: GrapoiPointer
}

export default function PropertyObjectInlineEditMode({ data, property }: PropertyObjectInlineEditModeProps) {
  const [mode, setMode] = useState<'view' | 'edit'>('view')
  const Editor = getWidget('editors', property, data)
  const Viewer = getWidget('viewers', property, data)

  if (!Editor || !Viewer) return null

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
      <Viewer term={data.term} data={data} property={property} />
      <button onClick={() => setMode(mode === 'view' ? 'edit' : 'view')}>
        <Icon icon="iconoir:edit-pencil" />
      </button>
    </>
  )
}
