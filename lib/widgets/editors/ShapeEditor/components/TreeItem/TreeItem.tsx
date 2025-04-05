import classNames from 'classnames'
import React, { forwardRef, HTMLAttributes } from 'react'

import Icon from '../../../../../components/various/Icon'
import { Handle } from '../../components/Item/Handle'
import { Remove } from '../../components/Item/Remove'
import styles from './TreeItem.module.css'

export interface Props extends Omit<HTMLAttributes<HTMLLIElement>, 'id'> {
  childCount?: number
  clone?: boolean
  collapsed?: boolean
  depth: number
  disableInteraction?: boolean
  disableSelection?: boolean
  ghost?: boolean
  handleProps?: any
  indicator?: boolean
  indentationWidth: number
  value: string
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
      wrapperRef,
      ...props
    },
    ref
  ) => {
    return (
      <li
        className={classNames(
          styles.Wrapper,
          clone && styles.clone,
          ghost && styles.ghost,
          indicator && styles.indicator,
          disableSelection && styles.disableSelection,
          disableInteraction && styles.disableInteraction
        )}
        ref={wrapperRef}
        style={
          {
            '--spacing': `${indentationWidth * depth}px`
          } as React.CSSProperties
        }
        {...props}
      >
        <div className={styles.TreeItem} ref={ref} style={style}>
          <Handle {...handleProps} />
          {onCollapse && (
            <button className="button small" onClick={onCollapse}>
              <Icon icon="mdi:caret-down-outline" style={collapsed ? { rotate: '-90deg' } : {}} />
            </button>
          )}
          <span className={styles.Text}>{label}</span>
          {!clone && onRemove && <Remove onClick={onRemove} />}
          {clone && childCount && childCount > 1 ? <span className={styles.Count}>{childCount}</span> : null}
        </div>
      </li>
    )
  }
)
