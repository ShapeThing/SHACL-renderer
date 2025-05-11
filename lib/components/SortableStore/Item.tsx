import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { language } from '@rdfjs/score'
import { NamedNode, Term } from '@rdfjs/types'
import { useContext } from 'react'
import Grapoi from '../../Grapoi'
import { languageContext } from '../../core/language-context'
import { rdfs, schema, sh } from '../../core/namespaces'
import List from './List'

type Props = {
  labelPredicates?: NamedNode[]
  id: string
  group: boolean
  pointer: Grapoi
}

const toLocalName = (term: Term) =>
  term ? (term.termType === 'NamedNode' ? term?.value?.split(/\/|#/g).pop() : term.value) : undefined

export default function Item({ id, pointer, labelPredicates, group }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })
  const { activeInterfaceLanguage } = useContext(languageContext)
  const style = {
    transform: CSS.Transform.toString({ x: transform?.x ?? 0, y: transform?.y ?? 0, scaleX: 1, scaleY: 1 }),
    transition
  }

  const localName = toLocalName(pointer.term)
  const matches = pointer.out(labelPredicates?.length ? labelPredicates : [sh('name'), rdfs('label'), schema('name')])
  const label =
    matches.best(language([activeInterfaceLanguage, '', '*'])).value ?? toLocalName(matches.terms[0]) ?? localName

  const labelElement = <span className="label">{label}</span>

  return (
    <li ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {group ? (
        <div>
          {labelElement}
          <List parent={pointer.term} />
        </div>
      ) : (
        labelElement
      )}
    </li>
  )
}
