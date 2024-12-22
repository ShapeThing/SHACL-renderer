import { language } from '@rdfjs/score'
import { useContext } from 'react'
import { languageContext } from '../core/language-context'
import { mainContext } from '../core/main-context'
import { sh, stsr } from '../core/namespaces'
import { getProperties, groupHasContents, PropertyGroupProps } from './PropertyGroup'

export default function CollapsiblePropertyGroup(props: PropertyGroupProps) {
  const localName = props.group.term.value.split(/\/|#/g).pop()
  const { data: dataset } = useContext(mainContext)
  const { activeContentLanguage } = useContext(languageContext)
  const properties = getProperties({ ...props, dataset })

  const groupLabelPath = props.group.out(stsr('groupLabelPath')).list()
  let label = props.group.out(sh('name')).best(language([activeContentLanguage, '', '*'])) ?? localName

  if (groupLabelPath) {
    /** @ts-ignore */
    label = [...groupLabelPath].map(pointer => {
      if (pointer.term.termType === 'Literal' && pointer.term.language === activeContentLanguage)
        return pointer.term.value
      return props.nodeDataPointer.out(pointer.term).best(language([activeContentLanguage, ''])).value
    })
  }

  return groupHasContents(props.group, props.shapePointer) ? (
    <details
      style={{ '--primary-rgb': '117, 0, 0', '--secondary-rgb': '151, 140, 151' } as any}
      className={`collapsible-group ${localName}`}
      data-term={props.group.term.value}
    >
      <summary className="title">{label}</summary>
      {properties}
    </details>
  ) : null
}
