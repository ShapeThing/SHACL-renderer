import factory from '@rdfjs/data-model'
import { NamedNode } from '@rdfjs/types'
import grapoi, { Grapoi } from 'grapoi'
import { debounce } from 'lodash-es'
import { Fragment, useContext, useEffect, useState } from 'react'
import { importShaclNodeFilterData } from '../../../core/importShaclNodeFilterData'
import { mainContext } from '../../../core/main-context'
import { rdfs, schema, stsr } from '../../../core/namespaces'
import { outAll } from '../../../helpers/outAll'
import { WidgetProps } from '../../widgets-context'

const getImage = (pointer?: Grapoi) => {
  return pointer
    ?.out()
    .values.find(value => ['jpg', 'png', 'jpeg', 'gif', 'webm'].some(extension => value.includes(extension)))
}

export default function AutoCompleteEditor({ term, setTerm, property }: WidgetProps) {
  const endpoint = property.out(stsr('endpoint')).value
  const {} = useContext(mainContext)
  const labels = [rdfs('label'), schema('name')]

  const [search, setSearch] = useState('')
  const [searchInstances, setSearchInstances] = useState<Grapoi>()
  const [selectedInstance, setSelectedInstance] = useState<Grapoi>()

  const image = getImage(selectedInstance)

  useEffect(() => {
    if (!term) return
    importShaclNodeFilterData({
      focusNode: term as NamedNode,
      shapeQuads: outAll(property.out().distinct().out()),
      endpoint
    }).then(dataset => setSelectedInstance(grapoi({ dataset, factory })))
  }, [term])

  useEffect(() => {
    if (search) {
      importShaclNodeFilterData({
        shapeQuads: outAll(property.out().distinct().out()),
        endpoint,
        limit: 20,
        searchTerm: search
      }).then(dataset => setSearchInstances(grapoi({ dataset, factory }).out().in().distinct()))
    } else {
      setSearchInstances(undefined)
    }
  }, [search])

  return (
    <Fragment>
      <div className="iri-preview">
        {image ? <img src={`//wsrv.nl/?url=${image}&w=32&h=32&fit=cover&a=focal&fpy=0.45`} /> : null}
        <span>{selectedInstance?.out(labels).value ?? term.value}</span>
      </div>
      <input
        className="input search"
        placeholder="Search..."
        value={search}
        type="search"
        onChange={debounce(async event => setSearch(event.target.value), 400)}
      />
      {searchInstances ? (
        <ul className="search-results">
          {searchInstances.map((searchInstance: Grapoi) => {
            const image = getImage(searchInstance)
            return (
              <div
                className="iri-preview"
                onClick={() => {
                  setTerm(searchInstance.term)
                  setSearch('')
                  setSearchInstances(undefined)
                }}
              >
                {image ? <img src={`//wsrv.nl/?url=${image}&w=32&h=32&fit=cover&a=focal&fpy=0.45`} /> : null}
                <span>{searchInstance?.out(labels).value ?? term.value}</span>
              </div>
            )
          })}
        </ul>
      ) : null}
    </Fragment>
  )
}
