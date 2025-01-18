import { language } from '@rdfjs/score'
import useResizeObserver from '@react-hook/resize-observer'
import { ReactNode, useContext, useLayoutEffect, useRef, useState } from 'react'
import { languageContext } from '../../core/language-context'
import { mainContext } from '../../core/main-context'
import { sh, stsr } from '../../core/namespaces'
import { nonNullable } from '../../helpers/nonNullable'
import Icon from '../various/Icon'
import { getProperties, groupHasContents, PropertyGroupProps } from './PropertyGroup'

export default function CollapsiblePropertyGroup(props: PropertyGroupProps) {
  const localName = props.group.term.value.split(/\/|#/g).pop()
  const { data: dataset, mode } = useContext(mainContext)
  const { activeInterfaceLanguage, activeContentLanguage } = useContext(languageContext)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const properties = getProperties({ ...props, dataset, mode }) as ReactNode[]

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

  const [expanded, setExpanded] = useState(groupLabelPath && !label ? true : false)
  const wrapper = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  useLayoutEffect(() => {
    if (content.current?.getBoundingClientRect().height) setHeight(content.current.getBoundingClientRect().height)
  }, [content])

  useResizeObserver(content, entry => {
    if (entry.contentRect.height && !isTransitioning) {
      setHeight(entry.contentRect.height)
    }
  })

  return groupHasContents(props.group, props.shapePointer) ? (
    <div
      ref={wrapper}
      className={`collapsible-group ${localName} ${expanded || !height ? 'expanded' : ''} ${height ? 'processed' : ''}`}
      data-term={props.group.term.value}
    >
      <button
        className="title"
        onClick={() => {
          setIsTransitioning(true)
          setTimeout(() => {
            setExpanded(!expanded)
            wrapper.current?.querySelector('.collapsible-group-contents')?.addEventListener(
              'transitionend',
              () => {
                setIsTransitioning(false)
                wrapper.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              },
              { once: true }
            )
          })
        }}
      >
        <Icon className="iconify" icon={'cuida:caret-right-outline'} />
        {label}
      </button>
      {/* We render this always, if we would only render when needed, Suspense items would trigger a re-render which conflict with expanding. */}
      <div
        ref={content}
        style={height && (isTransitioning || !expanded) ? { maxHeight: expanded ? height : 0 } : {}}
        className="collapsible-group-contents"
      >
        {properties}
      </div>
    </div>
  ) : null
}
