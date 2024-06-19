import { ReactNode } from 'react'
import { rdfs, sh } from '../core/namespaces'

type PropertyElementProps = {
  property?: GrapoiPointer
  label?: string
  children: ReactNode
  showColon?: true
}

export default function PropertyElement({ children, property, showColon, label: givenLabel }: PropertyElementProps) {
  const label = givenLabel ?? property?.out([sh('name'), rdfs('label')]).values?.[0] ?? ''

  return (
    <div className="property" data-term={property?.term.value}>
      <label>
        {label}
        {showColon ? ': ' : ''}
      </label>
      {children}
    </div>
  )
}
