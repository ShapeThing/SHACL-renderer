import factory from '@rdfjs/data-model'
import { DatasetCore, Quad_Object, Term } from '@rdfjs/types'
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

export default function PropertyObjectEditMode(props: PropertyObjectEditModeProps) {
  const { data, property } = props
  const { editors } = useContext(widgetsContext)
  const widgetItem = scoreWidgets(editors, data, property, dash('editor'))

  if (!widgetItem) return null

  const setTerm = (term: Term) => {
    const dataset: DatasetCore = data.ptrs[0].dataset
    const [quad] = [...data.quads()]
    // Grapoi remove seems to delete duplicates too.
    dataset.delete(quad)
    dataset.add(factory.quad(quad.subject, quad.predicate, term as Quad_Object, quad.graph))
  }

  return (
    <Fragment key={data.term.value}>
      <widgetItem.Component {...props} term={data.term} setTerm={setTerm} />
      <button>
        <IconXmark />
      </button>
    </Fragment>
  )
}
