import { ReactNode, useContext, useState } from 'react'
import { languageContext } from '../../core/language-context'
import { mainContext } from '../../core/main-context'
import { getProperties, groupHasContents, PropertyGroupProps } from './PropertyGroup'

import { Localized } from '@fluent/react'
import { language } from '@rdfjs/score'
import { Grapoi } from 'grapoi'
import { rdfs, sh } from '../../core/namespaces'
import parsePath from '../../helpers/parsePath'
import { useEmptyTerm } from '../EditMode/PropertyShapeEditMode'
import PropertyElement from '../PropertyElement'

export default function DrawerPropertyGroup(props: PropertyGroupProps) {
  const { activeInterfaceLanguage } = useContext(languageContext)
  const [selectedPropertyIndex, setSelectedPropertyIndex] = useState<number | string>()
  const [selectedProperty, setSelectedProperty] = useState<Grapoi>()
  const localName = props.group.term.value.split(/\/|#/g).pop()
  const { data: dataset, update } = useContext(mainContext)
  const properties = getProperties({ ...props, dataset, groupByUsage: true }) as {
    used: ReactNode[]
    unused: Grapoi[]
  }

  const createEmptyTerm = useEmptyTerm()

  const label = props.group.out(sh('name')).best(language([activeInterfaceLanguage, '', '*'])).value
  const description = props.group
    .out([sh('description'), rdfs('comment')])
    .best(language([activeInterfaceLanguage])).value

  return groupHasContents(props.group, props.shapePointer) ? (
    <div className={`group drawer ${localName} ${props.className ?? ''}`} data-term={props.group.term.value}>
      {label ? <h3 className="title">{label}</h3> : null}
      {description ? <div className="group-description">{description}</div> : null}
      <div className="group-inner">
        {properties.used}

        <PropertyElement label={<Localized id="add-a-property">Add a property</Localized>}>
          <div className="editors">
            <div className="editor drawer-add-property">
              <select
                value={selectedPropertyIndex}
                onChange={event => {
                  const selectedProperty = properties.unused[parseInt(event.target.value)]
                  if (selectedProperty) {
                    setSelectedProperty(selectedProperty)
                    setSelectedPropertyIndex(parseInt(event.target.value))
                  }
                }}
              >
                <option value={''}>
                  <Localized id="pick-an-option">- Pick an option -</Localized>
                </option>

                {properties.unused.map((property, index) => {
                  const label =
                    property?.out([sh('name'), rdfs('label')]).best(language([activeInterfaceLanguage, '', '*']))
                      ?.value ?? property?.out(sh('path')).value?.split(/\#|\//g).pop()

                  return (
                    <option key={property.values.join(',')} value={index}>
                      {label}
                    </option>
                  )
                })}
              </select>

              <button
                className="button primary"
                onClick={() => {
                  setSelectedPropertyIndex('')
                  setSelectedProperty(undefined)

                  if (!selectedProperty) return
                  const path = parsePath(selectedProperty.out(sh('path')))
                  const itemPointer = props.nodeDataPointer.executeAll(path)
                  const emptyTerm = createEmptyTerm(selectedProperty, itemPointer)
                  const predicate = path?.at(-1)?.predicates[0]

                  if (emptyTerm && predicate) {
                    props.nodeDataPointer.addOut(predicate, emptyTerm)
                    update()
                  }
                }}
              >
                <Localized id="add">Add</Localized>
              </button>
            </div>
          </div>
        </PropertyElement>
      </div>
    </div>
  ) : null
}
