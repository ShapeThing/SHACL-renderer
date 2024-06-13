import { Term } from '@rdfjs/types'
import { useContext } from 'react'
import { Fragment } from 'react/jsx-runtime'
import IconXmark from '~icons/iconoir/xmark'
import { scoreWidgets } from '../../core/scoreWidgets'
import { widgetsContext } from '../../widgets/widgets-context'
import { dash } from '../ShaclRenderer'

type PropertyObjectEditModeProps = {
  property: GrapoiPointer
  data: GrapoiPointer
  facetSearchData: GrapoiPointer
}

export default function PropertyObjectEditMode({ data, property, facetSearchData }: PropertyObjectEditModeProps) {
  const { editors } = useContext(widgetsContext)
  const widgetItem = scoreWidgets(editors, data, property, dash('editor'))
  if (!widgetItem) return null

  const setTerm = (term: Term) => data.replace(term)

  return (
    <Fragment key={data.term.value}>
      <widgetItem.Component
        term={data.term}
        setTerm={setTerm}
        data={data}
        property={property}
        searchData={facetSearchData}
      />
      <button>
        <IconXmark />
      </button>
    </Fragment>
  )
}
