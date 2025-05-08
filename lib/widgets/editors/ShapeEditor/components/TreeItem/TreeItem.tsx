import React, { forwardRef, HTMLAttributes, useContext } from 'react'

import { Localized } from '@fluent/react'
import { NamedNode } from '@rdfjs/types'
import EditNestedNodeButton from '../../../../../components/EditMode/EditNestedNodeButton'
import Icon from '../../../../../components/various/Icon'
import { mainContext } from '../../../../../core/main-context'
import { sh } from '../../../../../core/namespaces'
import { Handle } from '../../components/Item/Handle'
import { Remove } from '../../components/Item/Remove'

export interface Props extends Omit<HTMLAttributes<HTMLLIElement>, 'id'> {
  childCount?: number
  clone?: boolean
  collapsed?: boolean
  depth: number
  disableInteraction?: boolean
  disableSelection?: boolean
  ghost?: boolean
  handleProps?: any
  addBottomSpacing?: boolean
  indicator?: boolean
  indentationWidth: number
  value: string
  term: NamedNode
  type: 'group' | 'property' | 'root'
  label: string
  onCollapse?(): void
  onRemove?(): void
  wrapperRef?(node: HTMLLIElement): void
}

export const TreeItem = forwardRef<HTMLDivElement, Props>(
  (
    {
      childCount,
      clone,
      depth,
      disableSelection,
      disableInteraction,
      ghost,
      handleProps,
      indentationWidth,
      indicator,
      collapsed,
      onCollapse,
      onRemove,
      style,
      value,
      label,
      term,
      type,
      addBottomSpacing,
      wrapperRef,
      ...props
    },
    ref
  ) => {
    const { dataPointer, shapePointer } = useContext(mainContext)

    const groupOrPropertyPointer = dataPointer.node(term)
    const isProperty = !!groupOrPropertyPointer.hasOut(sh('path')).term

    const shapeIri = (
      isProperty
        ? shapePointer.node().hasOut(sh('path'), sh('path')).in()
        : shapePointer.node().hasOut(sh('targetClass'), sh('PropertyGroup'))
    ).term

    const subject = dataPointer.node(term)

    return (
      <li
        className={`${[
          'Wrapper',
          clone && 'clone',
          ghost && 'ghost',
          indicator && 'indicator',
          disableSelection && 'disableSelection',
          disableInteraction && 'disableInteraction'
        ]
          .filter(Boolean)
          .join(' ')} type-${type} ${addBottomSpacing ? 'spacing-bottom' : ''} ${collapsed ? 'collapsed' : ''}`}
        ref={wrapperRef}
        style={
          {
            '--spacing': `${indentationWidth * depth}px`
          } as React.CSSProperties
        }
        {...props}
      >
        <div className={'TreeItem'} ref={ref} style={style}>
          <Handle {...handleProps} />
          {onCollapse && (
            <button className="button small" onClick={onCollapse}>
              <Icon icon="mdi:caret-down-outline" style={collapsed ? { rotate: '-90deg' } : {}} />
            </button>
          )}
          <span className={'Text'}>
            <span className="type-label">
              {type === 'group' ? (
                <>
                  <Localized id="group">Group</Localized>:
                </>
              ) : null}
              &nbsp;
            </span>
            {label}
          </span>

          {!clone ? (
            <EditNestedNodeButton shapeIri={shapeIri} data={subject}>
              {onClick => (
                <button className="button icon" key={`edit-resource:${shapeIri.value}`} onClick={onClick}>
                  <Icon icon="fluent:document-edit-16-regular" />
                </button>
              )}
            </EditNestedNodeButton>
          ) : null}

          {!clone && onRemove && <Remove onClick={onRemove} />}
          {clone && childCount && childCount > 1 ? <span className={'Count'}>{childCount}</span> : null}
        </div>
      </li>
    )
  }
)
