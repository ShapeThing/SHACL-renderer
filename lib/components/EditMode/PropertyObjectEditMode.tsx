import factory from '@rdfjs/data-model'
import { DatasetCore, Quad_Object, Term } from '@rdfjs/types'
import { useContext } from 'react'
import { Fragment } from 'react/jsx-runtime'
import IconTrash from '~icons/mynaui/trash'
import { dash, sh } from '../../core/namespaces'
import { scoreWidgets } from '../../core/scoreWidgets'
import { widgetsContext } from '../../widgets/widgets-context'

type PropertyObjectEditModeProps = {
  property: GrapoiPointer
  data: GrapoiPointer
  facetSearchData: GrapoiPointer
  items: GrapoiPointer
}

export default function PropertyObjectEditMode(props: PropertyObjectEditModeProps) {
  const { data, property, items } = props
  const { editors } = useContext(widgetsContext)
  const widgetItem = scoreWidgets(editors, data, property, dash('editor'))

  if (!widgetItem) return null

  const minCount = property.out(sh('minCount')).value ? parseInt(property.out(sh('minCount')).value.toString()) : 0
  const itemIsRequired = items.ptrs.length <= minCount

  const setTerm = (term: Term) => {
    //grapoi.replace() does something else...
    const dataset: DatasetCore = data.ptrs[0].dataset
    const [quad] = [...data.quads()]
    dataset.delete(quad)
    dataset.add(factory.quad(quad.subject, quad.predicate, term as Quad_Object, quad.graph))
  }

  return (
    <Fragment>
      <widgetItem.Component {...props} term={data.term} setTerm={setTerm} />
      {!itemIsRequired ? (
        <button className="button icon remove-object" onClick={() => data.deleteIn()}>
          <IconTrash />
        </button>
      ) : null}
    </Fragment>
  )
}
