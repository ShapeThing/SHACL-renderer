import { Grapoi } from 'grapoi'
import { Fragment, ReactNode, useContext } from 'react'
import { mainContext } from '../core/main-context'
import { rdfs, sh, stsr } from '../core/namespaces'

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
  const { mode } = useContext(mainContext)

  const label =
    givenLabel ??
    property?.out([sh('name'), rdfs('label')]).values?.[0] ??
    property?.out(sh('path')).value.split(/\#|\//g).pop()

  const descriptionLines = property?.out(sh('description')).values[0]?.split('\n')

  const showTableHeaders = property?.out(stsr('showTableHeaders')).value

  let headerItems = []

  if (property && showTableHeaders) {
    const node = property.out(sh('node')).term
    const nodeShapePointer = property.node(node)

    const groups = nodeShapePointer
      .out(sh('property'))
      .out(sh('group'))
      .distinct()
      .map((pointer: Grapoi, index: number) => {
        const order = parseFloat(pointer.out(sh('order')).value ?? index.toString())
        return {
          group: pointer.term.value,
          order
        }
      })

    const properties = nodeShapePointer.out(sh('property')).map((pointer: Grapoi, index: number) => {
      const group = pointer.out(sh('group')).term.value
      return {
        order: parseFloat(pointer.out(sh('order')).value ?? index.toString()),
        label: pointer.out(sh('name')).values[0],
        group
      }
    })

    const mixed = [...properties, ...groups].toSorted((a, b) => a.order - b.order)
    const firstItem = mixed[0]

    headerItems = (
      firstItem.group ? mixed.filter(item => item.group === firstItem.group && item.label) : [firstItem]
    ).map(item => item.label)
  }

  return (
    <div className={`property ${cssClass ?? ''}`.trim()} data-term={property?.term.value}>
      <label>
        {label}
        {showColon ? ': ' : ''}
      </label>
      {mode === 'edit' && descriptionLines?.length ? (
        <p className="field-description">
          {descriptionLines.map(line => (
            <Fragment key={line}>
              {line}
              <br />
            </Fragment>
          ))}
        </p>
      ) : null}
      {showTableHeaders && headerItems.length ? (
        <div className="node-headers">
          {headerItems.map(headerItem => (
            <label className="node-header">{headerItem}</label>
          ))}
        </div>
      ) : null}
      {children}
    </div>
  )
}
