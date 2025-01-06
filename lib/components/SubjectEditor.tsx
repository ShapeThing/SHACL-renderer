import { Localized } from '@fluent/react'
import { Quad_Subject } from '@rdfjs/types'
import { useContext, useEffect, useState } from 'react'
import { mainContext } from '../core/main-context'
import { sh } from '../core/namespaces'
import { useDebounced } from '../hooks/useDebounced'
import URIEditor from '../widgets/editors/URIEditor'
import PropertyElement from './PropertyElement'

export default function SubjectEditor() {
  const { shapePointer, mode, dataPointer, renameSubject } = useContext(mainContext)
  if (mode !== 'edit') return null
  const nodeKind = shapePointer.out(sh('nodeKind')).term ?? sh('BlankNode')

  const [localTerm, setLocalTerm] = useState(dataPointer.term)

  const description = <Localized id="subject-editor-description">The IRI of this resource</Localized>

  const save = useDebounced(() => {
    if (!localTerm.equals(dataPointer.term)) renameSubject(localTerm as Quad_Subject)
  }, 300)

  useEffect(() => {
    save()
  }, [localTerm])

  return nodeKind.equals(sh('IRI')) || dataPointer.term.termType === 'NamedNode' ? (
    <PropertyElement
      description={description}
      cssClass="subject-editor"
      required
      label={<Localized id="subject">Subject</Localized>}
    >
      <div className="editors">
        <div className="editor">
          {/* @ts-expect-error We only want to use half of the interface of URIEditor */}
          <URIEditor
            term={localTerm}
            setTerm={newSubject => {
              setLocalTerm(newSubject)
            }}
          />
        </div>
      </div>
    </PropertyElement>
  ) : null
}
