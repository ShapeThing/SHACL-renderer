import { language } from '@rdfjs/score'
import { Term } from '@rdfjs/types'
import { useContext } from 'react'
import { languageContext } from '../../core/language-context'
import { sh } from '../../core/namespaces'
import Grapoi from '../../Grapoi'
import { allLogicalPointers } from '../../helpers/allLogicalPointers'
import Icon from '../various/Icon'
import { useEmptyTerm, useWidget } from './PropertyShapeEditMode'

type AddButtonsProps = {
  property: Grapoi
  items: Grapoi
  addTerm: (term: Term) => void
}

export function AddButtons({ property, items, addTerm }: AddButtonsProps) {
  const { activeInterfaceLanguage } = useContext(languageContext)
  const uniqueLang = property.out(sh('uniqueLang')).term?.value === 'true'
  const maxCount = property.out(sh('maxCount')).value
    ? parseInt(property.out(sh('maxCount')).value.toString())
    : Infinity

  const expandedOptions = property.out(sh('or')).isList()
    ? allLogicalPointers(property).map(option => ({
        term: option.terms.at(-1)!,
        pointer: option,
        label: option
          .out(sh('name'))
          // We must remove labels from the base pointer.
          .filter((item: Grapoi) => !property.out(sh('name')).terms.some(term => term.equals(item.term)))
          .best(language([activeInterfaceLanguage, '', '*'])).value
      }))
    : []

  const createEmptyTerm = useEmptyTerm()
  const widgetItem = useWidget()(property, items)

  if (widgetItem?.meta.hidePlusButton || items.ptrs.length >= maxCount || uniqueLang) {
    return null
  }

  return (
    <div className="plus-options">
      {expandedOptions.length ? (
        expandedOptions.map(expandedOption => (
          <button
            key={expandedOption.term.value}
            onClick={() => {
              const emptyTerm = createEmptyTerm(expandedOption.pointer, items)
              if (emptyTerm) addTerm(emptyTerm)
            }}
            className="button icon secondary outline add-object"
          >
            <Icon icon="iconoir:plus" /> <span>{expandedOption.label}</span>
          </button>
        ))
      ) : (
        <button
          className="button icon secondary outline add-object"
          onClick={() => {
            const emptyTerm = createEmptyTerm(property, items)
            if (emptyTerm) addTerm(emptyTerm)
          }}
        >
          <Icon icon="iconoir:plus" />
        </button>
      )}
    </div>
  )
}
