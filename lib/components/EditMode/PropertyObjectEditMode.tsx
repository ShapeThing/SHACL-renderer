import factory from '@rdfjs/data-model'
import { Quad_Object, Term } from '@rdfjs/types'
import { Grapoi } from 'grapoi'
import { useContext } from 'react'
import { Fragment } from 'react/jsx-runtime'
import IconTrash from '~icons/mynaui/trash'
import { dash, sh } from '../../core/namespaces'
import { scoreWidgets } from '../../core/scoreWidgets'
import { widgetsContext } from '../../widgets/widgets-context'

type PropertyObjectEditModeProps = {
  property: Grapoi
  data: Grapoi
  facetSearchData: Grapoi
  items: Grapoi
  errors?: string[]
}

export default function PropertyObjectEditMode(props: PropertyObjectEditModeProps) {
  const { data, property, items, errors } = props
  const { editors } = useContext(widgetsContext)
  const widgetItem = scoreWidgets(editors, data, property, dash('editor'))

  if (!widgetItem) return null

  const minCount = property.out(sh('minCount')).value ? parseInt(property.out(sh('minCount')).value.toString()) : 0
  const itemIsRequired = items.ptrs.length <= minCount

  const setTerm = (term: Term) => {
    const dataset = data.ptrs[0].dataset
    const [quad] = [...data.quads()]

    if (quad.object.equals(term)) return
    dataset.add(factory.quad(quad.subject, quad.predicate, term as Quad_Object, quad.graph))
  }

  const deleteTerm = () => {
    const dataset = data.ptrs[0].dataset
    const [quad] = [...data.quads()]
    dataset.delete(quad)
  }

  return (
    <Fragment>
      <widgetItem.Component {...props} term={data.term} setTerm={setTerm} />
      {!itemIsRequired ? (
        <button className="button icon remove-object" onClick={deleteTerm}>
          <IconTrash />
        </button>
      ) : null}

      {errors?.length ? <em className="errors">{errors.join('\n')}</em> : null}
    </Fragment>
  )
}
