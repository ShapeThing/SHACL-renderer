import { useDndMonitor } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { language } from '@rdfjs/score'
import { NamedNode, Term } from '@rdfjs/types'
import { useContext, useState } from 'react'
import { languageContext } from '../../core/language-context'
import { rdfs, schema, sh } from '../../core/namespaces'
import { GrapoiWithId } from './SortableStore'

type Props = {
  labelPredicates?: NamedNode[]
  id: string
  group: boolean
  pointer: GrapoiWithId
  className?: string
}

const toLocalName = (term: Term) =>
  term ? (term.termType === 'NamedNode' ? term?.value?.split(/\/|#/g).pop() : term.value) : undefined

export default function Item({ id, pointer, labelPredicates, group, className }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, node } = useSortable({ id })
  const parents: Term[] = []

  let groupPointer = pointer.out(sh('group'))

  while (groupPointer?.term) {
    parents.push(groupPointer.term)
    groupPointer = groupPointer.out(sh('group'))
  }

  const { activeInterfaceLanguage } = useContext(languageContext)
  const [hidden, setHidden] = useState(false)
  const style = {
    transform: CSS.Transform.toString({ x: transform?.x ?? 0, y: transform?.y ?? 0, scaleX: 1, scaleY: 1 }),
    transition,
    '--depth': pointer.depth
  }

  useDndMonitor({
    onDragStart: event => {
      setHidden(!!parents.length && parents.some(parent => event.active.id === parent.value))
    },
    onDragEnd() {
      setHidden(false)
    }
  })

  const localName = toLocalName(pointer.term)
  const matches = pointer.out(labelPredicates?.length ? labelPredicates : [sh('name'), rdfs('label'), schema('name')])
  const label =
    matches.best(language([activeInterfaceLanguage, '', '*'])).value ?? toLocalName(matches.terms[0]) ?? localName

  return (
    <li
      className={`item ${group ? 'grouped' : ''} ${hidden ? 'hidden' : ''} ${className}`}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <span className="label">{label}</span>
    </li>
  )
}
