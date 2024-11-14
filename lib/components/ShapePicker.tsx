import { Grapoi } from 'grapoi'
import { useContext } from 'react'
import { mainContext, Settings } from '../core/main-context'
import { rdfs, sh } from './ShaclRenderer'

export default function ShapePicker() {
  const { shapePointers, mode, setPointerByIri } = useContext(mainContext)

  type UiModes = Exclude<Settings['mode'], 'type' | 'data'>

  const modeLabels: Record<UiModes, string> = {
    edit: 'Select a form',
    facet: 'Select facets',
    'inline-edit': 'Select a form',
    view: 'Select a view'
  }

  const modeLabel = ['data', 'type'].includes(mode) ? '' : modeLabels[mode as keyof typeof modeLabels]

  return (
    <div className="shape-picker property">
      <label>{modeLabel}</label>
      <div className="editor">
        <select onChange={event => setPointerByIri(event.target.value)}>
          {shapePointers.map((shapePointer: Grapoi) => (
            <option key={shapePointer.term.value} value={shapePointer.term.value}>
              {shapePointer.out([sh('name'), rdfs('label')]).values[0] ?? shapePointer.term.value.split(/\/|\#/g).pop()}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
