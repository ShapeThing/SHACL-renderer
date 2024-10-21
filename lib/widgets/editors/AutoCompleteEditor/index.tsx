import { debounce } from 'lodash-es'
import { Fragment, useContext, useState } from 'react'
import { importShaclNodeFilterData } from '../../../core/importShaclNodeFilterData'
import { mainContext } from '../../../core/main-context'
import { stsr } from '../../../core/namespaces'
import { outAll } from '../../../helpers/outAll'
import { WidgetProps } from '../../widgets-context'

export default function AutoCompleteEditor({ term, setTerm, property, data }: WidgetProps) {
  const endpoint = property.out(stsr('endpoint')).value
  const {} = useContext(mainContext)

  const [search, setSearch] = useState('')

  // onBlur={event => setTerm(factory.namedNode(event.target.value))}

  return (
    <Fragment>
      <span>{term.value}</span>
      <input
        className="input"
        type="search"
        onChange={debounce(async event => {
          const quads = await importShaclNodeFilterData({
            property,
            dataPointer: data,
            shapeQuads: outAll(property.out().distinct().out()),
            endpoint,
            limit: 20,
            searchTerm: event.target.value
          })

          console.log(quads)
        }, 400)}
      />
    </Fragment>
  )
}
