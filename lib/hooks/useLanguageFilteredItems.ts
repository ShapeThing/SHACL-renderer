import { Literal } from '@rdfjs/types'
import { useContext, useEffect, useState } from 'react'
import { languageContext } from '../core/language-context'
import { mainContext } from '../core/main-context'
import Grapoi from '../Grapoi'

export const useLanguageFilteredItems = (fetcher: () => Grapoi) => {
  const { languageMode } = useContext(mainContext)
  const { activeContentLanguage } = useContext(languageContext)

  const filter = (pointer: Grapoi) =>
    pointer.filter(item => {
      if (languageMode === 'individual') return true
      if (!(item.term as Literal)?.language) return true
      return (item.term as Literal)?.language === activeContentLanguage
    })
  const [items, setItems] = useState(filter(fetcher()))

  useEffect(() => {
    setItems(filter(fetcher()))
  }, [activeContentLanguage])

  const setItemsFiltered = (pointer: Grapoi) => {
    setItems(filter(pointer))
  }

  return [items, setItemsFiltered] as [Grapoi, React.Dispatch<React.SetStateAction<Grapoi>>]
}
