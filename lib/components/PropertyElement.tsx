import { Localized } from '@fluent/react'
import { language } from '@rdfjs/score'
import { Grapoi } from 'grapoi'
import { Fragment, ReactNode, useContext } from 'react'
import { languageContext } from '../core/language-context'
import { mainContext } from '../core/main-context'
import { rdfs, sh } from '../core/namespaces'

type PropertyElementProps = {
  property?: Grapoi
  label?: string
  children: ReactNode
  showColon?: true
  cssClass?: string
  suffix?: ReactNode
}

export default function PropertyElement({
  children,
  cssClass,
  property,
  showColon,
  suffix,
  label: givenLabel
}: PropertyElementProps) {
  const { mode } = useContext(mainContext)
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

  const optional = !((minCount ?? 0) > 0)

  return (
    <div className={`property ${cssClass ?? ''}`.trim()} data-term={property?.values.join(':')}>
      <label>
        {label}
        {showColon ? ': ' : ''}
        {optional ? (
          <em className="optional">
            (<Localized id="optional">optional</Localized>)
          </em>
        ) : (
          ''
        )}
      </label>
      {children}
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
      {suffix}
    </div>
  )
}
