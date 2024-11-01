import { Icon } from '@iconify-icon/react'
import factory from '@rdfjs/data-model'
import { NamedNode } from '@rdfjs/types'
import grapoi, { Grapoi } from 'grapoi'
import { useContext, useEffect, useRef, useState } from 'react'
import { importShaclNodeFilterData } from '../../../core/importShaclNodeFilterData'
import { mainContext } from '../../../core/main-context'
import { rdfs, schema, stsr } from '../../../core/namespaces'
import Image from '../../../helpers/Image'
import { outAll } from '../../../helpers/outAll'
import { useDebounced } from '../../../helpers/useDebounced'
import { WidgetProps } from '../../widgets-context'

const getImage = (pointer?: Grapoi) => {
  return pointer
    ?.out()
    ?.values.find(value => ['jpg', 'png', 'jpeg', 'gif', 'webm'].some(extension => value.includes(extension)))
}

const isValidIri = (iri: string) => {
  try {
    new URL(iri)
    return true
  } catch {}
}

export default function AutoCompleteEditor({ term, setTerm, property }: WidgetProps) {
  const { data } = useContext(mainContext)
  const endpoint = property.out(stsr('endpoint')).value
  const labels = [rdfs('label'), schema('name')]
  const [search, setSearch] = useState(term.value)
  const [searchInstances, setSearchInstances] = useState<Grapoi>()
  const [selectedInstance, setSelectedInstance] = useState<Grapoi>()
  const [mode, setMode] = useState<'edit' | 'view'>(!term?.value ? 'edit' : 'view')
  const [isLoading, setIsLoading] = useState(false)
  const shapeQuads = outAll(property.out().distinct().out())
  const searchInput = useRef<HTMLInputElement>(null)
  const searchResults = useRef<HTMLDivElement>(null)
  const image = getImage(selectedInstance)

  const searchHandler = useDebounced(async event => {
    const search = event.target.value
    setSearchInstances(undefined)
    setSearch(search)
    setIsLoading(true)

    importShaclNodeFilterData({
      shapeQuads,
      endpoint,
      dataset: data,
      limit: 20,
      focusNode: isValidIri(search) ? factory.namedNode(search) : undefined,
      searchTerm: isValidIri(search) ? undefined : search
    }).then(dataset => {
      setIsLoading(false)
      setSearchInstances(grapoi({ dataset, factory }).out().in().distinct())
      setTimeout(() => searchResults.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }))
    })
  })

  // Loading the triples from the selected subject
  useEffect(() => {
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

  const apply = (iri: NamedNode) => {
    setTerm(iri)
    setMode('view')
    setSearch(iri.value)
    setSearchInstances(undefined)
  }

  const tryApply = (event: any) => {
    try {
      new URL(event.target.value)
      apply(factory.namedNode(event.target.value))
    } catch {}
  }

  return (
    <div className={`inner ${isLoading ? 'is-loading' : ''}`}>
      <span className={`${isLoading ? 'loader' : 'hidden'}`}></span>
      {!isLoading && mode === 'view' ? (
        <div className="iri-preview selected" title={term.value}>
          {image ? <Image className="image" url={image} size={32} /> : null}
          <a href={term.value} target="_blank" className="label">
            {selectedInstance?.out(labels).value ?? term.value}
          </a>
          <Icon
            icon="mynaui:pencil"
            onClick={() => {
              setMode('edit')
              setTimeout(() => searchInput.current?.select())
            }}
          />
        </div>
      ) : null}
      {mode === 'edit' ? (
        <input
          className="input search"
          placeholder="Search or paste a link..."
          autoFocus
          value={search}
          onKeyUp={event => (['Escape', 'Enter'].includes(event.key) ? tryApply(event) : null)}
          onBlur={tryApply}
          ref={searchInput}
          type="search"
          onChange={searchHandler}
        />
      ) : null}
      {searchInstances && mode === 'edit' ? (
        <div className="search-results-wrapper" ref={searchResults}>
          <div className="search-results">
            {searchInstances.ptrs.length
              ? searchInstances.map((searchInstance: Grapoi) => {
                  const image = getImage(searchInstance)
                  return (
                    <div
                      key={searchInstance.term.value}
                      className="iri-preview search-result"
                      onClick={() => apply(searchInstance.term)}
                    >
                      {image ? <Image className="image" url={image} size={32} /> : null}
                      <span className="label">{searchInstance?.out(labels).value ?? term.value}</span>
                    </div>
                  )
                })
              : null}
            {!searchInstances.ptrs.length ? (
              <div className="no-results">Search for something, no results found</div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}
