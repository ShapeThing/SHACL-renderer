import { Icon } from '@iconify-icon/react'
import { language } from '@rdfjs/score'
import { useContext, useEffect, useRef, useState } from 'react'
import { languageContext } from '../core/language-context'
import { mainContext } from '../core/main-context'
import { sh, stsr } from '../core/namespaces'
import { nonNullable } from '../helpers/nonNullable'
import { getProperties, groupHasContents, PropertyGroupProps } from './PropertyGroup'

export default function CollapsiblePropertyGroup(props: PropertyGroupProps) {
  const localName = props.group.term.value.split(/\/|#/g).pop()
  const { data: dataset } = useContext(mainContext)
  const { activeInterfaceLanguage, activeContentLanguage } = useContext(languageContext)
  const properties = getProperties({ ...props, dataset })
  const [expanded, setExpanded] = useState(false)
  const wrapper = useRef<HTMLDivElement>(null)

  const groupLabelPath = props.group.out(stsr('groupLabelPath')).list()
  let label = props.group.out(sh('name')).best(language([activeInterfaceLanguage, '', '*'])).value ?? localName

  if (groupLabelPath) {
    /** @ts-ignore */
    const groupLabelPathPointers: Grapoi[] = [...groupLabelPath]

    const hasMultipleLanguages =
      groupLabelPathPointers.map(pointer => pointer.term.language).filter(nonNullable).length > 1

    label = groupLabelPathPointers
      .map(pointer => {
        if (pointer.term.termType === 'Literal') {
          if (hasMultipleLanguages && pointer.term.language === activeInterfaceLanguage) return pointer.term.value
          if (!hasMultipleLanguages) return pointer.term.value
          return ''
        }
        return props.nodeDataPointer.out(pointer.term).best(language([activeContentLanguage, '', '*'])).value
      })
      .join('')
  }

  useEffect(() => {
    if (expanded) wrapper.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [expanded])

  return groupHasContents(props.group, props.shapePointer) ? (
    <div
      ref={wrapper}
      // style={{ '--primary-rgb': '117, 0, 0', '--secondary-rgb': '151, 140, 151' } as any}
      className={`collapsible-group ${localName} ${expanded ? 'expanded' : ''}`}
      data-term={props.group.term.value}
    >
      <button className="title" onClick={() => setExpanded(!expanded)}>
        <Icon className="iconify" icon={expanded ? 'cuida:caret-down-outline' : 'cuida:caret-right-outline'} />
        {label}
      </button>
      {expanded ? <div className="collapsible-group-contents">{properties}</div> : null}
    </div>
  ) : null
}
