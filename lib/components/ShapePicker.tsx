import dataFactory from '@rdfjs/data-model'
import { Grapoi } from 'grapoi'
import { useContext } from 'react'
import { mainContext, Settings } from '../core/main-context'
import { dash, rdf, rdfs, sh, xsd } from './ShaclRenderer'

export default function ShapePicker() {
  const { shapesPointer, shapePointer, mode, setShapeSubject, shapeSubject } = useContext(mainContext)

  const modeLabels: Record<Settings['mode'], string> = {
    edit: 'Select a form',
    facet: 'Select facets',
    'inline-edit': 'Select a form',
    view: 'Select a view'
  }

  const modeLabel = ['data', 'type'].includes(mode) ? '' : modeLabels[mode as keyof typeof modeLabels]

  // TODO not super sure about this. The ShapePicker hides shapes that are used in the current hierarchy.
  const activeShapeParentTerms = shapePointer.terms.filter(term => !shapeSubject.equals(term))
  const shapePointers = shapesPointer.hasOut(rdf('type'), sh('NodeShape'))
  const validShapes = shapePointers
    .filter(shapePointer => !activeShapeParentTerms.some(term => term.equals(shapePointer.term)))
    .filter(shapePointer => !shapePointer.out(dash('abstract'), dataFactory.literal('true', xsd('boolean'))).value)

  return validShapes.ptrs.length > 1 ? (
    <div className="shape-picker property">
      <label>{modeLabel}</label>
      <div className="editor">
        <select value={shapeSubject.value} onChange={event => setShapeSubject(event.target.value)}>
          {validShapes.map((shapePointer: Grapoi) => (
            <option key={shapePointer.term.value} value={shapePointer.term.value}>
              {shapePointer.out([sh('name'), rdfs('label')]).values[0] ?? shapePointer.term.value.split(/\/|\#/g).pop()}
            </option>
          ))}
        </select>
      </div>
    </div>
  ) : null
}
