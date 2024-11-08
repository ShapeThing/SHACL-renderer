import { Icon } from '@iconify-icon/react'
import factory from '@rdfjs/data-model'
import { useState } from 'react'
import Dropzone from 'react-dropzone'
import { Fragment } from 'react/jsx-runtime'
import { dash, sh, stsr } from '../../../core/namespaces'
import Image from '../../../helpers/Image'
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
  const [isWorking, setIsWorking] = useState(false)
  const [newFileName, setNewFileName] = useState(term.value)

  const uploadFiles = async (files: File[]) => {
    const uploadUrl = property.out(stsr('uploadUrl')).value
    if (!uploadUrl) throw new Error('Missing stsr:uploadUrl')
    const prefix = property.out(dash('uriStart'))?.value?.split(/\/|#/g).pop() ?? ''

    const formData = new FormData()
    for (const file of files) {
      formData.append('files', file)
    }

    const response = await fetch(`${uploadUrl}/${prefix ? `/${prefix}` : ''}`, { body: formData, method: 'POST' })
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

      {/* The value for the term */}
      {term.value ? (
        <div key={term.value} title={term.value} className="iri-preview search-result">
          <Image className="image" url={term.value} size={32} />

          {mode === 'edit' ? (
            <Fragment>
              <input
                className="input borderless"
                value={newFileName}
                autoFocus
                onChange={event => setNewFileName(event.target.value)}
              />
              <Icon
                icon="mynaui:check"
                onClick={() => {
                  setMode('view')
                  if (newFileName !== term.value) {
                    setIsWorking(true)

                    // TODO Fetch, Upload, Delete Old, setTerm.
                  }
                }}
              />
            </Fragment>
          ) : (
            <Fragment>
              <a className="link" href={term.value} target="_blank">
                <span className="label">{decodeURI(term.value.split(/\/|\#/g).pop()!)}</span>
              </a>
              {isWorking ? <Icon className="spinner" icon="svg-spinners:180-ring" /> : null}
              {!isWorking ? <Icon icon="mynaui:pencil" onClick={() => setMode('edit')} /> : null}
            </Fragment>
          )}
        </div>
      ) : null}
    </Fragment>
  )
}
