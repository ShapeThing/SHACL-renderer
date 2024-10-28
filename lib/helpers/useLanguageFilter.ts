import { Grapoi } from 'grapoi'
import { useContext } from 'react'
import { languageContext } from '../core/language-context'
import { mainContext } from '../core/main-context'

export const useLanguageFilter = () => {
  const { languageMode } = useContext(mainContext)
  const { activeContentLanguage } = useContext(languageContext)
  return (pointer: Grapoi) =>
    pointer.filter(item => {
      if (languageMode === 'individual') return true
      if (!(item.term as any)?.language) return true
      return (item.term as any)?.language === activeContentLanguage
    })
}
