import factory from '@rdfjs/data-model'
import { NamedNode } from '@rdfjs/types'
import grapoi, { Grapoi } from 'grapoi'
import { debounce } from 'lodash-es'
import { useEffect, useRef, useState } from 'react'
import IconPencil from '~icons/mynaui/pencil'
import { importShaclNodeFilterData } from '../../../core/importShaclNodeFilterData'
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
  const labels = [rdfs('label'), schema('name')]

  const [search, setSearch] = useState('')
  const [searchInstances, setSearchInstances] = useState<Grapoi>()
  const [selectedInstance, setSelectedInstance] = useState<Grapoi>()
  const [mode, setMode] = useState<'edit' | 'view'>('view')
  const [isLoading, setIsLoading] = useState(false)
  const shapeQuads = outAll(property.out().distinct().out())

  const image = getImage(selectedInstance)

  useEffect(() => {
    if (!term.value && mode !== 'edit') setMode('edit')
  }, [term])

  useEffect(() => {
    if (searchInput.current) searchInput.current.value = ''
    if (!term?.value || !shapeQuads.length || !endpoint) return
    setIsLoading(true)
    importShaclNodeFilterData({
      focusNode: term as NamedNode,
      shapeQuads,
      endpoint
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

  const searchInput = useRef<HTMLInputElement>(null)
  const searchResults = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (mode === 'edit') searchInput.current?.focus()
  }, [mode])

  useEffect(() => {
    setTimeout(() => {
      searchResults.current?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }, [searchInstances])

  return (
    <div className={`inner ${isLoading ? 'is-loading' : ''}`}>
      {isLoading ? '...' : ''}
      {mode === 'view' ? (
        <div className="iri-preview selected" onClick={() => setMode('edit')}>
          {image ? (
            <img
              onError={event => (event.target as HTMLImageElement).classList.add('has-error')}
              className="image"
              src={`//wsrv.nl/?url=${image}&w=32&h=32&fit=cover&a=focal&fpy=0.45`}
            />
          ) : null}
          <span className="label">{selectedInstance?.out(labels).value ?? term.value}</span>
          <IconPencil />
        </div>
      ) : (
        <input
          className="input search"
          placeholder="Search..."
          autoFocus
          onKeyUp={event => {
            if (event.key === 'Escape') {
              setSearch('')
              setMode('view')
              setSearchInstances(undefined)
            }
          }}
          onBlur={(event: any) => {
            if (event.rangeParent === searchInput.current) {
              setSearch('')
              setMode('view')
              setSearchInstances(undefined)
            }
          }}
          ref={searchInput}
          type="search"
          onChange={debounce(async event => setSearch(event.target.value), 400)}
        />
      )}
      {searchInstances?.ptrs.length ? (
        <div className="search-results-wrapper" ref={searchResults}>
          <ul className="search-results">
            {searchInstances.map((searchInstance: Grapoi) => {
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
                  {image ? (
                    <img
                      onError={event => (event.target as HTMLImageElement).classList.add('has-error')}
                      className="image"
                      src={`//wsrv.nl/?url=${image}&w=32&h=32&fit=cover&a=focal&fpy=0.45`}
                    />
                  ) : null}
                  <span className="label">{searchInstance?.out(labels).value ?? term.value}</span>
                </div>
              )
            })}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
