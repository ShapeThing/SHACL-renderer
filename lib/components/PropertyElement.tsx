import { ReactNode } from 'react'
import { rdfs, sh } from '../core/namespaces'

type PropertyElementProps = {
  property: GrapoiPointer
  children: ReactNode
  showColon?: true
}

export default function PropertyElement({ children, property, showColon }: PropertyElementProps) {
  const label = property.out([sh('name'), rdfs('label')]).values

  return (
    <div className="property" data-term={property.term.value}>
      <label>
        {label}
        {showColon ? ': ' : ''}
      </label>
      {children}
    </div>
  )
}
