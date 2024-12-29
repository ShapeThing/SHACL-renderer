import { Icon } from '@iconify-icon/react'
import { language } from '@rdfjs/score'
import { Term } from '@rdfjs/types'
import { Grapoi } from 'grapoi'
import { useContext } from 'react'
import { languageContext } from '../../core/language-context'
import { sh } from '../../core/namespaces'
import { allLogicalPointers } from '../../helpers/allLogicalPointers'
import { useEmptyTerm } from './PropertyShapeEditMode'

type AddButtonsProps = {
  property: Grapoi
  items: Grapoi
  addTerm: (term: Term) => void
}

export function AddButtons({ property, items, addTerm }: AddButtonsProps) {
  const { activeContentLanguage } = useContext(languageContext)
  const uniqueLang = property.out(sh('uniqueLang')).term?.value === 'true'
  const maxCount = property.out(sh('maxCount')).value
    ? parseInt(property.out(sh('maxCount')).value.toString())
    : Infinity

  if (items.ptrs.length >= maxCount || uniqueLang) {
    return null
  }

  const expandedOptions = property.out(sh('or')).isList()
    ? allLogicalPointers(property).map(option => ({
        term: option.terms.at(-1)!,
        pointer: option,
        label: option
          .out(sh('name'))
          // We must remove labels from the base pointer.
          .filter(item => !property.out(sh('name')).terms.some(term => term.equals(item.term)))
          .best(language([activeContentLanguage, '', '*'])).value
      }))
    : []

  const createEmptyTerm = useEmptyTerm(items, property)

  return (
    <div className="plus-options">
      {expandedOptions.length ? (
        expandedOptions.map(expandedOption => (
          <button
            key={expandedOption.term.value}
            onClick={() => {
              const emptyTerm = createEmptyTerm(expandedOption.pointer)
              if (emptyTerm) addTerm(emptyTerm)
            }}
            className="button icon secondary add-object"
          >
            <Icon icon="iconoir:plus" /> <span>{expandedOption.label}</span>
          </button>
        ))
      ) : (
        <button
          className="button icon secondary add-object"
          onClick={() => {
            const emptyTerm = createEmptyTerm()
            if (emptyTerm) addTerm(emptyTerm)
          }}
        >
          <Icon icon="iconoir:plus" />
        </button>
      )}
    </div>
  )
}
