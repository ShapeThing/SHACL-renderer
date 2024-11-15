import factory from '@rdfjs/data-model'
import { Term } from '@rdfjs/types'
import { Grapoi } from 'grapoi'
import Dropzone from 'react-dropzone'
import Image from '../../../components/Image'
import { dash, sh, stsr } from '../../../core/namespaces'
import parsePath from '../../../helpers/parsePath'
import { WidgetProps } from '../../widgets-context'

type UploadFileArguments = {
  property: Grapoi
  files: File[]
  data: Grapoi
  rerender: () => void
}

const uploadFiles = async ({ property, files, data, rerender }: UploadFileArguments) => {
  const uploadUrl = property.out(stsr('uploadUrl')).value
  if (!uploadUrl) throw new Error('Missing stsr:uploadUrl')
  const prefix = property.out(dash('uriStart'))?.value?.split(/\/|#/g).pop() ?? ''
  const formData = new FormData()
  for (const file of files) formData.append('files', file)
  const response = await fetch(`${uploadUrl}/${prefix ? `/${prefix}` : ''}`, { body: formData, method: 'POST' })
  const filePaths = await response.json()
  const shPath = parsePath(property.out(sh('path')))
  const predicate = shPath[0].predicates[0]
  for (const filePath of filePaths) data.addOut(predicate, factory.namedNode(filePath))
  rerender()
}

export default function FileUploadEditor({
  term,
  rerenderAfterManipulatingPointer: rerender,
  property,
  nodeDataPointer,
  useConfigureWidget
}: WidgetProps) {
  useConfigureWidget({
    header: () => (
      <Dropzone onDrop={files => uploadFiles({ files, property, data: nodeDataPointer, rerender })}>
        {({ getRootProps, getInputProps }) => (
          <div className={`drop-zone ${term.value ? 'has-value' : ''}`} {...getRootProps()}>
            <input {...getInputProps()} />
            <span className="info">Drag some files here or click to select files</span>
          </div>
        )}
      </Dropzone>
    ),
    displayCriteria: (term: Term) => !!term.value,
    deletionCriteria: async (term: Term) => (await fetch(term.value)).status === 200
  })

  return term.value ? (
    <div key={term.value} title={term.value} className="iri-preview search-result">
      <Image className="image" url={term.value} size={32} />
      <a className="link" href={term.value} target="_blank">
        <span className="label">{decodeURI(term.value.split(/\/|\#/g).pop()!)}</span>
      </a>
    </div>
  ) : null
}
