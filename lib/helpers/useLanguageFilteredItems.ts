import { Grapoi } from 'grapoi'
import { useContext, useEffect, useState } from 'react'
import { languageContext } from '../core/language-context'
import { mainContext } from '../core/main-context'

export const useLanguageFilteredItems = (fetcher: () => Grapoi) => {
  const { languageMode } = useContext(mainContext)
  const { activeContentLanguage } = useContext(languageContext)

  const filter = (pointer: Grapoi) =>
    pointer.filter(item => {
      if (languageMode === 'individual') return true
      if (!(item.term as any)?.language) return true
      return (item.term as any)?.language === activeContentLanguage
    })
  const [items, setItems] = useState(filter(fetcher()))

  useEffect(() => {
    setItems(filter(fetcher()))
  }, [activeContentLanguage])

  return [items, setItems] as [Grapoi, React.Dispatch<React.SetStateAction<Grapoi>>]
}
