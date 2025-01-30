import { useContext } from 'react'
import { languageContext } from '../../../core/language-context'
import { mainContext } from '../../../core/main-context'
import { WidgetProps } from '../../widgets-context'

export default function LiteralTransformer({ term }: WidgetProps) {
  const { usedLanguageCodes } = useContext(languageContext)
  const { languageMode } = useContext(mainContext)

  const mustShownLanguageCode =
    term.termType === 'Literal' &&
    term.language &&
    (languageMode === 'individual' ||
      usedLanguageCodes.length === 1) /* we hide the languages tab when there is only one language */

  return (
    <span>
      {term.value}
      {mustShownLanguageCode ? <em className="language-label">{term.language}</em> : null}
    </span>
  )
}
