import { Icon } from '@iconify-icon/react'
import factory from '@rdfjs/data-model'
import { useState } from 'react'
import Dropzone from 'react-dropzone'
import { Fragment } from 'react/jsx-runtime'
import { dash, sh, stsr } from '../../../core/namespaces'
import parsePath from '../../../helpers/parsePath'
import { WidgetProps } from '../../widgets-context'

export default function FileUploadEditor({
  term,
  rerenderAfterManipulatingPointer,
  property,
  index,
  setTerm,
  nodeDataPointer
}: WidgetProps) {
  const [mode, setMode] = useState<'view' | 'edit'>(term.value ? 'view' : 'edit')

  const uploadFiles = async (files: File[]) => {
    const uploadUrl = property.out(stsr('uploadUrl')).value
    if (!uploadUrl) throw new Error('Missing stsr:uploadUrl')
    const prefix = property.out(dash('uriStart'))?.value?.split(/\/|#/g).pop() ?? ''

    const formData = new FormData()
    for (const file of files) {
      formData.append('files', file)
    }

    const response = await fetch(`${uploadUrl}/${prefix}/`, { body: formData, method: 'POST' })
    const filePaths = await response.json()
    const shPath = parsePath(property.out(sh('path')))
    const predicate = shPath[0].predicates[0]

    for (const filePath of filePaths) {
      nodeDataPointer.addOut(predicate, factory.namedNode(filePath))
    }

    rerenderAfterManipulatingPointer()
  }

  return (
    <Fragment>
      {/* The header where the user can drag and drop files */}
      {index === 0 ? (
        <Dropzone onDrop={uploadFiles}>
          {({ getRootProps, getInputProps }) => (
            <div className={`drop-zone ${term.value ? 'has-value' : ''}`} {...getRootProps()}>
              <input {...getInputProps()} />
              <span className="info">Drag some files here or click to select files</span>
            </div>
          )}
        </Dropzone>
      ) : null}

      {mode === 'edit' && term.value ? (
        <input className="input" value={term.value} onChange={event => setTerm(factory.literal(event.target.value))} />
      ) : null}

      {term.value && mode === 'view' ? (
        <div key={term.value} className="iri-preview search-result">
          {/* {image ? <Image className="image" url={image} size={32} /> : null} */}
          <span className="label">{term.value}</span>
          <Icon icon="mynaui:pencil" onClick={() => setMode('edit')} />
        </div>
      ) : null}
    </Fragment>
  )
}
