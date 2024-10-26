import { Grapoi } from 'grapoi'
import { ReactNode } from 'react'
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
  const label =
    givenLabel ??
    property?.out([sh('name'), rdfs('label')]).values?.[0] ??
    property?.out(sh('path')).value.split(/\#|\//g).pop()

  const descriptionLines = property?.out(sh('description')).values[0]?.split('\n')

  return (
    <div className={`property ${cssClass ?? ''}`.trim()} data-term={property?.term.value}>
      <label>
        {label}
        {showColon ? ': ' : ''}
      </label>
      {descriptionLines?.length ? (
        <p className="field-description">
          {descriptionLines.map(line => (
            <>
              {line}
              <br />
            </>
          ))}
        </p>
      ) : null}
      {children}
    </div>
  )
}
