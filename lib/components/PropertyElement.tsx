import { Localized } from '@fluent/react'
import { Icon } from '@iconify-icon/react/dist/iconify.mjs'
import { language } from '@rdfjs/score'
import { Term } from '@rdfjs/types'
import { Grapoi } from 'grapoi'
import { Fragment, ReactNode, useContext } from 'react'
import { languageContext } from '../core/language-context'
import { mainContext } from '../core/main-context'
import { rdf, rdfs, sh, stsr } from '../core/namespaces'
import { TouchableTerm } from '../helpers/touchableRdf'

type PropertyElementProps = {
  property?: Grapoi
  label?: string | ReactNode
  children: ReactNode
  showColon?: true
  cssClass?: string
  description?: ReactNode
  suffix?: ReactNode
  required?: true
}

export default function PropertyElement({
  children,
  cssClass,
  property,
  showColon,
  suffix,
  required,
  description,
  label: givenLabel
}: PropertyElementProps) {
  const { mode, dataPointer } = useContext(mainContext)
  const { activeInterfaceLanguage } = useContext(languageContext)

  const label =
    givenLabel ??
    property?.out([sh('name'), rdfs('label')]).best(language([activeInterfaceLanguage, '', '*']))?.value ??
    property?.out(sh('path')).value?.split(/\#|\//g).pop()

  const descriptionLines = property
    ?.out(sh('description'))
    .best(language([activeInterfaceLanguage, '', '*']))
    ?.value?.split('\n')

  const minCount = property?.out(sh('minCount')).value ? parseInt(property?.out(sh('minCount')).value) : undefined
  const optional = required ? false : !((minCount ?? 0) > 0)
  const uniqueLang = property?.out(sh('uniqueLang')).term?.value === 'true'
  const isLanguageDataType = property?.out(sh('datatype')).term?.equals(rdf('langString'))

  const hiddenWhenPredicate = property?.out(stsr('hiddenWhen')).term

  const mustBeHidden = hiddenWhenPredicate
    ? dataPointer.out(hiddenWhenPredicate).terms.filter((term: Term) => (term as TouchableTerm).touched !== false)
        .length
    : false

  return (
    <div
      className={`property ${mustBeHidden ? 'hidden' : 'expanded'} ${cssClass ?? ''}`.trim()}
      data-term={property?.values.join(':')}
    >
      <label className="label">
        {label}
        {showColon ? ': ' : ''}
        {mode === 'edit' && (uniqueLang || isLanguageDataType) ? (
          <Icon className="multilingual" icon="mdi:language" />
        ) : null}
        {mode === 'edit' && optional ? (
          <em className="optional">
            (<Localized id="optional">optional</Localized>)
          </em>
        ) : null}
      </label>
      {description ? <span className="field-description">{description}</span> : null}
      {mode === 'edit' && descriptionLines?.length ? (
        <span className="field-description">
          {descriptionLines.map(line => (
            <Fragment key={line}>
              {line}
              <br />
            </Fragment>
          ))}
        </span>
      ) : null}
      {children}
      {suffix}
    </div>
  )
}
