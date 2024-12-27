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
}

export default function PropertyElement({
  children,
  cssClass,
  property,
  showColon,
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

  return (
    <div className={`property ${cssClass ?? ''}`.trim()} data-term={property?.values.join(':')}>
      <label>
        {label}
        {showColon ? ': ' : ''}
      </label>
      {mode === 'edit' && descriptionLines?.length ? (
        <p className="field-description">
          {descriptionLines.map(line => (
            <Fragment key={line}>
              {line}
              <br />
            </Fragment>
          ))}
        </p>
      ) : null}
      {children}
    </div>
  )
}
