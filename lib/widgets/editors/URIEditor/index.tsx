import { Icon } from '@iconify-icon/react/dist/iconify.mjs'
import factory from '@rdfjs/data-model'
import { useContext } from 'react'
import { mainContext } from '../../../core/main-context'
import { isValidIri } from '../../../helpers/isValidIri'
import { WidgetProps } from '../../widgets-context'

export default function URIEditor({ term, setTerm }: WidgetProps) {
  const { subjectEditLocalNameOnly } = useContext(mainContext)
  const { jsonLdContext } = useContext(mainContext)
  const compactedIri = jsonLdContext.compactIri(term.value)
  let prefixAlias = ''
  const lastPart = term.value.split(/#|\//g).pop()!

  const before = subjectEditLocalNameOnly ? term.value.substring(0, term.value.length - lastPart?.length) : ''
  let value = subjectEditLocalNameOnly ? term.value.split(/#|\//g).pop() : term.value

  const prefixes = Object.fromEntries(Object.entries(jsonLdContext.getContextRaw()).filter(([key]) => key[0] !== '@'))

  if (compactedIri !== term.value) {
    ;[prefixAlias, value] = compactedIri.split(/:(.*)/s)
  }

  const exactMatch = Object.entries(prefixes).find(([_alias, prefix]) => prefix === term.value)?.[0]
  if (exactMatch) {
    prefixAlias = exactMatch
    value = ''
  }

  return (
    <div className="uri-selector" title={term.value}>
      {!subjectEditLocalNameOnly ? (
        <select
          className="prefix"
          value={prefixAlias}
          onChange={event => {
            const newPrefixAlias = prefixes[event.target.value]
            if (newPrefixAlias) {
              setTerm(factory.namedNode(`${newPrefixAlias ?? ''}${value ?? ''}`))
            } else {
              setTerm(factory.namedNode(``))
            }
          }}
        >
          <option value={''}>(None)</option>
          {Object.entries(prefixes).map(([alias]) => {
            return (
              <option key={alias} value={alias}>
                {alias}
              </option>
            )
          })}
        </select>
      ) : null}
      <input
        className="input"
        onChange={event => {
          if (subjectEditLocalNameOnly) {
            setTerm(factory.namedNode(`${before}${event.target.value ?? ''}`))
            return
          }
          if (isValidIri(event.target.value)) {
            setTerm(factory.namedNode(event.target.value))
          } else {
            const prefix = prefixes[prefixAlias]
            setTerm(factory.namedNode(`${prefix ?? ''}${event.target.value ?? ''}`))
          }
        }}
        value={value}
      />

      {term.value ? (
        <a className="link" href={term.value} target="_blank">
          <Icon icon={'mdi:external-link'} />
        </a>
      ) : null}
    </div>
  )
}
