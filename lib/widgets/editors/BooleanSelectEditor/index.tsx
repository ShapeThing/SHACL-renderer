import factory from '@rdfjs/data-model'
import { language } from '@rdfjs/score'
import { useContext, useId } from 'react'
import { languageContext } from '../../../core/language-context'
import { rdfs, sh, xsd } from '../../../core/namespaces'
import { WidgetProps } from '../../widgets-context'

export default function BooleanSelectEditor({ term, setTerm, property }: WidgetProps) {
  const currentValue = term.value === '1' || term.value === 'true'
  const { activeInterfaceLanguage } = useContext(languageContext)

  const label =
    property?.out([sh('name'), rdfs('label')]).best(language([activeInterfaceLanguage, '', '*']))?.value ??
    property?.out(sh('path')).value.split(/\#|\//g).pop()

  const id = useId()

  return (
    <>
      <input
        type="checkbox"
        id={id}
        className="input"
        checked={currentValue}
        onChange={event => setTerm(factory.literal(event.target.checked ? 'true' : 'false', xsd('boolean')))}
      />
      <label className="label" htmlFor={id}>
        {label}
      </label>
    </>
  )
}
