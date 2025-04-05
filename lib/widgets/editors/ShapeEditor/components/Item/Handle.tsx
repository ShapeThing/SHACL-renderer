import { forwardRef } from 'react'

import Icon from '../../../../../components/various/Icon'

export const Handle = forwardRef<HTMLButtonElement>((props, ref) => {
  return (
    <button className="button small" ref={ref} data-cypress="draggable-handle" {...props}>
      <Icon icon="mdi:drag" />
    </button>
  )
})
