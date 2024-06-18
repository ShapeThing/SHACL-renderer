import { Term } from '@rdfjs/types'
import { useContext } from 'react'
import { Fragment } from 'react/jsx-runtime'
import IconTrash from '~icons/mynaui/trash'
import { scoreWidgets } from '../../core/scoreWidgets'
import { widgetsContext } from '../../widgets/widgets-context'
import { dash } from '../ShaclRenderer'

type PropertyObjectEditModeProps = {
  property: GrapoiPointer
  data: GrapoiPointer
  facetSearchData: GrapoiPointer
  rerenderProperty: () => void
}

export default function PropertyObjectEditMode(props: PropertyObjectEditModeProps) {
  const { data, property, rerenderProperty } = props
  const { editors } = useContext(widgetsContext)
  const widgetItem = scoreWidgets(editors, data, property, dash('editor'))

  if (!widgetItem) return null

  const setTerm = (term: Term) => {
    data.replace(term)
    rerenderProperty()
  }

  const deleteTerm = () => {
    const [quad] = [...data.quads()]
    const { dataset } = data.ptrs[0]
    dataset.delete(quad)
    rerenderProperty()
  }

  return (
    <Fragment key={data.term.value}>
      <widgetItem.Component {...props} term={data.term} setTerm={setTerm} />
      <button className="button icon remove-object" onClick={deleteTerm}>
        <IconTrash />
      </button>
    </Fragment>
  )
}
