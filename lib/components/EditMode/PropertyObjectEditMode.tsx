import { Icon } from '@iconify/react'
import { Term } from '@rdfjs/types'
import { Fragment } from 'react/jsx-runtime'
import { getWidget } from '../../core/getWidget'

type PropertyObjectEditModeProps = {
  property: GrapoiPointer
  data: GrapoiPointer
}

export default function PropertyObjectEditMode({ data, property }: PropertyObjectEditModeProps) {
  const Editor = getWidget('editors', property, data)

  const setTerm = (term: Term) => data.replace(term)

  return Editor ? (
    <Fragment key={data.term.value}>
      <Editor term={data.term} setTerm={setTerm} data={data} property={property} />
      <button>
        <Icon icon="iconoir:xmark" />
      </button>
    </Fragment>
  ) : null
}
