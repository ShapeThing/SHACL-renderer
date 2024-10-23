import factory from '@rdfjs/data-model'
import { NamedNode } from '@rdfjs/types'
import grapoi, { Grapoi } from 'grapoi'
import { debounce } from 'lodash-es'
import { useContext, useEffect, useRef, useState } from 'react'
import IconPencil from '~icons/mynaui/pencil'
import { importShaclNodeFilterData } from '../../../core/importShaclNodeFilterData'
import { mainContext } from '../../../core/main-context'
import { rdfs, schema, stsr } from '../../../core/namespaces'
import Image from '../../../helpers/Image'
import { outAll } from '../../../helpers/outAll'
import { WidgetProps } from '../../widgets-context'

const getImage = (pointer?: Grapoi) => {
  return pointer
    ?.out()
    ?.values.find(value => ['jpg', 'png', 'jpeg', 'gif', 'webm'].some(extension => value.includes(extension)))
}

export default function AutoCompleteEditor({ term, setTerm, property }: WidgetProps) {
  const { data } = useContext(mainContext)

  const endpoint = property.out(stsr('endpoint')).value
  const labels = [rdfs('label'), schema('name')]

  const [search, setSearch] = useState('')
  const [searchInstances, setSearchInstances] = useState<Grapoi>()
  const [selectedInstance, setSelectedInstance] = useState<Grapoi>()
  const [mode, setMode] = useState<'edit' | 'view'>('view')
  const [isLoading, setIsLoading] = useState(true)
  const shapeQuads = outAll(property.out().distinct().out())

  const searchInput = useRef<HTMLInputElement>(null)
  const searchResults = useRef<HTMLDivElement>(null)

  const image = getImage(selectedInstance)

  useEffect(() => {
    if (!term && mode !== 'edit') setMode('edit')
  }, [term])

  useEffect(() => {
    if (searchInput.current) searchInput.current.value = ''
    if (!term?.value || !shapeQuads.length) return
    setIsLoading(true)
    importShaclNodeFilterData({
      focusNode: term as NamedNode,
      shapeQuads,
      endpoint,
      dataset: data
    }).then(dataset => {
      setIsLoading(false)
      setSelectedInstance(grapoi({ dataset, factory }))
    })
  }, [term])

  useEffect(() => {
    if (search) {
      setIsLoading(true)
      importShaclNodeFilterData({
        shapeQuads,
        endpoint,
        dataset: data,
        limit: 20,
        searchTerm: search
      }).then(dataset => {
        setIsLoading(false)
        setSearchInstances(grapoi({ dataset, factory }).out().in().distinct())
      })
    } else {
      setIsLoading(false)
      setSearchInstances(undefined)
    }
  }, [search])

  useEffect(() => {
    if (mode === 'edit') searchInput.current?.focus()
  }, [mode])

  useEffect(() => {
    searchResults.current?.scrollIntoView({ behavior: 'smooth' })
  }, [searchInstances])

  const clear = () => {
    setSearch('')
    setMode('view')
    setSearchInstances(undefined)
  }

  return (
    <div className={`inner ${isLoading ? 'is-loading' : ''}`}>
      {isLoading ? <span className="loader"></span> : ''}
      {!isLoading && mode === 'view' ? (
        <div className="iri-preview selected" onClick={() => setMode('edit')}>
          {image ? <Image className="image" url={image} size={32} /> : null}
          <span className="label">{selectedInstance?.out(labels).value ?? term.value}</span>
          <IconPencil />
        </div>
      ) : null}
      {!isLoading && mode === 'edit' ? (
        <input
          className="input search"
          placeholder="Search..."
          autoFocus
          onKeyUp={event => (event.key === 'Escape' ? clear() : null)}
          onBlur={(event: any) => (event.rangeParent === searchInput.current ? clear() : null)}
          ref={searchInput}
          type="search"
          onChange={debounce(async event => setSearch(event.target.value), 400)}
        />
      ) : null}
      {searchInstances ? (
        <div className="search-results-wrapper" ref={searchResults}>
          <div className="search-results">
            {searchInstances.ptrs.length
              ? searchInstances.map((searchInstance: Grapoi) => {
                  const image = getImage(searchInstance)
                  return (
                    <div
                      className="iri-preview"
                      onClick={() => {
                        setTerm(searchInstance.term)
                        setSearch('')
                        setMode('view')
                        setSearchInstances(undefined)
                      }}
                    >
                      {image ? <Image className="image" url={image} size={32} /> : null}
                      <span className="label">{searchInstance?.out(labels).value ?? term.value}</span>
                    </div>
                  )
                })
              : null}
            {!searchInstances.ptrs.length ? <div className="no-results">No results found</div> : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}
