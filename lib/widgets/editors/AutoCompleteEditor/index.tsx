import { Icon } from '@iconify-icon/react'
import factory from '@rdfjs/data-model'
import datasetFactory from '@rdfjs/dataset'
import { NamedNode } from '@rdfjs/types'
import grapoi, { Grapoi } from 'grapoi'
import { useContext, useEffect, useRef, useState, useTransition } from 'react'
import Image from '../../../components/various/Image'
import { fetchDataAccordingToProperty } from '../../../core/fetchDataAccordingToProperty'
import { mainContext } from '../../../core/main-context'
import { sh, stsr } from '../../../core/namespaces'
import { getImageFromPointer } from '../../../helpers/getImageFromPointer'
import { getPurposePredicates } from '../../../helpers/getPurposePredicates'
import { isValidIri } from '../../../helpers/isValidIri'
import { outAll } from '../../../helpers/outAll'
import { useDebounced } from '../../../hooks/useDebounced'
import { WidgetProps } from '../../widgets-context'

export default function AutoCompleteEditor({ term, setTerm, property }: WidgetProps) {
  const { data } = useContext(mainContext)
  const endpoint: string | undefined = property.out(stsr('endpoint')).value

  const labels = getPurposePredicates(property.out(sh('node')), 'label')
  const [search, setSearch] = useState(term.value)
  const [searchInstances, setSearchInstances] = useState<Grapoi>()
  const [selectedInstance, setSelectedInstance] = useState<Grapoi>()
  const [mode, setMode] = useState<'edit' | 'view'>(!term?.value ? 'edit' : 'view')
  const [isLoading, setIsLoading] = useState(false)
  const shapeQuads = outAll(property.out().distinct().out())
  const searchInput = useRef<HTMLInputElement>(null)
  const searchResults = useRef<HTMLDivElement>(null)
  const image = getImageFromPointer(selectedInstance, property.out(sh('node')))
  const [_isPending, startTransition] = useTransition()

  const searchHandler = useDebounced((search: string) => {
    if (!data && !endpoint) return

    setSearchInstances(undefined)
    setIsLoading(true)

    fetchDataAccordingToProperty({
      nodeShape: property,
      endpoint,
      dataset: data,
      term: isValidIri(search) ? factory.namedNode(search) : undefined,
      searchTerm: isValidIri(search) ? '' : search
    }).then(quads => {
      setIsLoading(false)
      const dataset = datasetFactory.dataset(quads)
      setSearchInstances(grapoi({ dataset, factory }).out().in().distinct())
      setTimeout(() => searchResults.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }))
    })
  })

  // Loading the triples from the selected subject
  useEffect(() => {
    if (!term?.value || !shapeQuads.length) return
    setIsLoading(true)

    fetchDataAccordingToProperty({
      nodeShape: property,
      term: term as NamedNode,
      endpoint,
      dataset: data
    }).then(async quads => {
      const dataset = datasetFactory.dataset(quads)
      setSelectedInstance(grapoi({ dataset, factory, term }))
      setIsLoading(false)
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
    } catch {
      apply(term as NamedNode)
    }
  }

  return (
    <div className={`inner ${isLoading ? 'is-loading' : ''}`}>
      {!isLoading && mode === 'view' ? (
        <div className="iri-preview selected" title={term.value}>
          {image ? <Image className="image" url={image} size={32} /> : null}
          <a href={term.value} target="_blank" className="label">
            {selectedInstance?.out(labels).value ?? term.value}
          </a>
          <Icon
            icon="mynaui:pencil"
            onClick={() => {
              searchHandler(term.value)
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
          onBlur={() => {
            setTimeout(tryApply, 200)
          }}
          ref={searchInput}
          type="search"
          onInput={event => {
            const search = (event.target as HTMLInputElement).value
            setSearch(search)
            startTransition(() => {
              searchHandler(search)
            })
          }}
        />
      ) : null}
      <span className={`loader ${!isLoading ? 'hidden' : ''}`}>Loading...</span>
      {searchInstances && mode === 'edit' ? (
        <div className="search-results-wrapper" ref={searchResults}>
          <div className="search-results">
            {searchInstances.ptrs.length
              ? [...searchInstances].map((searchInstance: Grapoi) => {
                  const image = getImageFromPointer(searchInstance)
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
