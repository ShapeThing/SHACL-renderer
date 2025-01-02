import { Icon } from '@iconify-icon/react'
import factory from '@rdfjs/data-model'
import { useContext, useEffect, useRef, useState } from 'react'
import { fetchContext } from '../../../core/fetchContext'
import { stsr } from '../../../core/namespaces'
import { WidgetProps } from '../../widgets-context'

export default function IconifyEditor({ term, setTerm, property }: WidgetProps) {
  const { fetch } = useContext(fetchContext)
  const [searchTerm, setSearchTerm] = useState(term?.value)
  const [results, setResults] = useState<Array<string> | null>(null)
  const collections = property.out([stsr('collections')]).values
  const [mode, setMode] = useState<'view' | 'edit'>(term.value ? 'view' : 'edit')
  const inputReference = useRef<HTMLInputElement>(null)
  const [highlightIndex, setHightlightIndex] = useState(-1)

  useEffect(() => {
    setResults([])

    if (!searchTerm) return

    fetch(`https://api.iconify.design/search?query=${searchTerm}&limit=96`)
      .then(response => response.json())
      .then(response => {
        const filteredIcons = response.icons.filter((icon: string) =>
          collections.length ? collections.some(collection => icon.includes(collection)) : true
        )

        setResults(filteredIcons)
      })
  }, [searchTerm])

  const setIcon = (icon: string) => {
    setTerm(factory.literal(icon, factory.namedNode('https://iconify.design')))
    setSearchTerm(icon)
    setResults([])
    setMode('view')
  }

  return (
    <>
      <div className="inner">
        {mode === 'view' ? (
          <div className="iri-preview selected" title={term.value}>
            <Icon className="image" icon={term.value} />
            <span className="label">{term.value}</span>
            <Icon
              icon="mynaui:pencil"
              onClick={() => {
                setMode('edit')
                setTimeout(() => inputReference.current?.select())
              }}
            />
          </div>
        ) : null}

        {mode === 'edit' ? (
          <input
            type="text"
            ref={inputReference}
            onKeyUp={event => {
              if (event.key === 'Escape') setMode('view')
              if (event.key === 'Enter') {
                const icon = results ? results[highlightIndex] : undefined
                if (icon) setIcon(icon)
              }
              if (event.key === 'ArrowUp') setHightlightIndex(index => Math.max(-1, index - 1))
              if (event.key === 'ArrowDown')
                setHightlightIndex(index => Math.min(index + 1, (results?.length ?? 0) + 1))
            }}
            onBlur={event => {
              setTimeout(() => {
                if (document.body.contains(event.target)) {
                  setMode('view')
                }
              }, 150)
            }}
            className="input"
            onChange={event => {
              setSearchTerm(event.target.value)
              setHightlightIndex(-1)
            }}
            value={searchTerm}
          />
        ) : null}

        {mode === 'edit' && results?.length ? (
          <div className="iconify-search-results">
            {results.map((icon, index) => (
              <button
                title={icon}
                onClick={() => setIcon(icon)}
                className={`button ${index === highlightIndex ? 'active' : ''}`}
                key={icon}
              >
                <Icon icon={icon} />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </>
  )
}
