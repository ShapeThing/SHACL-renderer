import { Localized } from '@fluent/react'
import factory from '@rdfjs/data-model'
import { language } from '@rdfjs/score'
import { Grapoi } from 'grapoi'
import { groupBy } from 'lodash-es'
import { useContext } from 'react'
import { languageContext } from '../../core/language-context'
import { mainContext } from '../../core/main-context'
import { dash, rdf, rdfs, schema, sh } from '../../core/namespaces'

type Action = {
  type: 'create-type' | 'edit'
  shape?: Grapoi
  data?: Grapoi
}

const actionId = (action: Action) => `${action.type}||${action.shape?.term?.value}||${action.data?.term?.value}`

const getLabel = (pointer?: Grapoi, activeInterfaceLanguage?: string): string => {
  if (!pointer) return ''

  const label = pointer
    ?.out([sh('name'), rdfs('label'), schema('name')])
    .best(language([activeInterfaceLanguage, '', '*']))?.value
  if (label) return label
  return pointer.term?.split(/\/|\#/g).pop() ?? ''
}

export default function ActionPicker({ contextCache }: { contextCache: Map<string, any> }) {
  const { activeInterfaceLanguage } = useContext(languageContext)

  const { dataPointer, shapesPointer, originalInput, setShapeSubject, setSubject } = useContext(mainContext)
  const allShapes = shapesPointer.node().hasOut(rdf('type'), sh('NodeShape'))
  const hasShapes = !!allShapes.ptrs.length
  const mainShapes = allShapes.filter(shape => !shape.hasOut(dash('abstract')).term?.value)
  const subShapes = allShapes.filter(shape => !!shape.hasOut(dash('abstract')).term?.value)

  const targetClasses = allShapes.out(sh('targetClass')).terms
  const subjects = hasShapes
    ? dataPointer.node().hasOut(rdf('type'), targetClasses)
    : dataPointer
        .node()
        .hasOut(rdf('type'))
        .filter(pointer => pointer.term.termType === 'NamedNode')

  const actions: Action[] = []

  for (const mainShape of mainShapes) {
    const shapesInput = originalInput.shapes?.toString()

    // When we have a mainShape that is also the original input shape we do not allow the creation of it.
    if (shapesInput !== mainShape.term.value) actions.push({ type: 'create-type', shape: mainShape })

    const subjectsForShape = subjects.filter(
      pointer => pointer.hasOut(rdf('type'), mainShape.out(sh('targetClass')).term).term
    )
    for (const data of subjectsForShape) actions.push({ type: 'edit', shape: mainShape, data })
  }

  for (const subShape of subShapes) {
    // Sub shapes can not be created stand alone.
    const subjectsForShape = subjects.filter(
      pointer => pointer.hasOut(rdf('type'), subShape.out(sh('targetClass')).term).term
    )

    for (const data of subjectsForShape) {
      const fieldUsesShape = !!shapesPointer.node().hasOut(sh('node'), subShape.term).term
      if (!fieldUsesShape) actions.push({ type: 'edit', shape: subShape, data })
    }
  }

  const groupedActions = groupBy(actions, action => getLabel(action.shape, activeInterfaceLanguage))

  return (
    <div className="action-picker">
      <label className="label">
        <Localized id="action">Action</Localized>
      </label>
      <select
        onChange={event => {
          const [actionType, shapeTerm, dataTerm] = event.target.value.split('||')
          contextCache.clear() // TODO cache is still not functioning correctly.
          if (shapeTerm) setShapeSubject(shapeTerm)
          if (dataTerm) setSubject(factory.namedNode(dataTerm))

          console.log(actionType, shapeTerm, dataTerm)
        }}
      >
        {Object.entries(groupedActions).map(([groupLabel, actions]) => {
          return (
            <optgroup label={groupLabel} key={groupLabel}>
              {actions.map(action => {
                const label = getLabel(action.data, activeInterfaceLanguage)
                return (
                  <option key={actionId(action)} value={actionId(action)}>
                    <Localized vars={{ type: groupLabel.toLocaleLowerCase(), thing: label }} id={action.type} />
                  </option>
                )
              })}
            </optgroup>
          )
        })}
      </select>
    </div>
  )
}
