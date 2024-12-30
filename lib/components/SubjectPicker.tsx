import { Localized } from '@fluent/react'
import factory from '@rdfjs/data-model'
import { language } from '@rdfjs/score'
import { Grapoi } from 'grapoi'
import { useContext } from 'react'
import { languageContext } from '../core/language-context'
import { mainContext } from '../core/main-context'
import { rdf, rdfs, sh } from '../core/namespaces'

export default function SubjectPicker() {
  const { shapePointer, dataPointer, subject, setSubject } = useContext(mainContext)
  const targetClass = shapePointer.out(sh('targetClass')).term
  const { activeInterfaceLanguage } = useContext(languageContext)

  const subjects = dataPointer.node().hasOut(rdf('type'), targetClass)

  const options = subjects.map((subjectPointer: Grapoi) => {
    const label = subjectPointer
      .out([sh('name'), rdfs('label')])
      .best(language([activeInterfaceLanguage, '', '*'])).value
    return { term: subjectPointer.term, label }
  })

  return options.length > 1 ? (
    <div className="subject-picker">
      <label className="label">
        <Localized id="select-subject">Select subject</Localized>
      </label>
      <select
        value={subject.value}
        onChange={event => {
          setSubject(factory.namedNode(event.target.value))
        }}
      >
        {options.map(({ term, label }) => (
          <option key={term.value} value={term.value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  ) : null
}
