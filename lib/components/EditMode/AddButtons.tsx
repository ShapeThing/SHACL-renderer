import { Icon } from '@iconify-icon/react'
import factory from '@rdfjs/data-model'
import { language } from '@rdfjs/score'
import { Grapoi } from 'grapoi'
import { useContext } from 'react'
import { languageContext } from '../../core/language-context'
import { sh } from '../../core/namespaces'
import parsePath from '../../helpers/parsePath'
import { TouchableTerm } from '../../helpers/touchableRdf'

type AddButtonsProps = {
  property: Grapoi
  items: Grapoi
  onAdd: (params: { activeContentLanguage?: string }) => void
}

export function AddButtons({ property, items, onAdd }: AddButtonsProps) {
  const { activeContentLanguage } = useContext(languageContext)
  const uniqueLang = property.out(sh('uniqueLang')).term?.value === 'true'
  const maxCount = property.out(sh('maxCount')).value
    ? parseInt(property.out(sh('maxCount')).value.toString())
    : Infinity
  const path: any = parsePath(property.out(sh('path')))

  if (items.ptrs.length >= maxCount || uniqueLang) {
    return null
  }

  const expandedOptions = property.out(sh('or')).isList()
    ? [...property.out(sh('or')).list()].map(option => ({
        term: option.term,
        pointer: option,
        label: option.out(sh('name')).best(language([activeContentLanguage, '', '*'])).value
      }))
    : []

  if (expandedOptions.length) {
    return (
      <div className="plus-options">
        {expandedOptions.map(expandedOption => (
          <button
            key={expandedOption.term.value}
            onClick={() => {
              let term = undefined
              const nodeKind = expandedOption.pointer.out(sh('nodeKind')).term

              if (nodeKind?.equals(sh('IRI'))) {
                term = factory.namedNode('')
              }

              if (nodeKind?.equals(sh('Literal'))) {
                term = factory.literal('')
              }

              if (term) {
                ;(term as TouchableTerm).touched = false
                items.addOut(path[0].predicates[0], term)
                onAdd({ activeContentLanguage })
              }
            }}
            className="button icon secondary add-object"
          >
            <Icon icon="iconoir:plus" /> <span>{expandedOption.label}</span>
          </button>
        ))}
      </div>
    )
  }

  return (
    <button className="button icon secondary add-object" onClick={() => onAdd({ activeContentLanguage })}>
      <Icon icon="iconoir:plus" />
    </button>
  )
}
