import EditorJS, { OutputData } from '@editorjs/editorjs'
import Header from '@editorjs/header'
import List from '@editorjs/list'
import datasetFactory from '@rdfjs/dataset'
import { Grapoi } from 'grapoi'
import { useEffect, useId, useRef } from 'react'
import { ed } from '../../../core/namespaces'
import { outAll } from '../../../helpers/outAll'
import { dataToRdf } from '../../../tools/data/dataToRdf'
import { rdfToData } from '../../../tools/data/rdfToData'
import { WidgetProps } from '../../widgets-context'

const editorJsOutputDataToRdf = async (outputData: OutputData) => {
  const quads = await dataToRdf({
    data: outputData,
    shapes: new URL('/shapes/editorjs-output.ttl', location.toString()),
    context: { '@vocab': ed().value }
  })

  console.log(quads)
}

const rdfToEditorJsOutputData = async (pointer: Grapoi) =>
  rdfToData({
    data: datasetFactory.dataset(outAll(pointer.distinct().out())),
    shapes: new URL('/shapes/editorjs-output.ttl', location.toString()),
    context: { '@vocab': ed().value }
  })

export default function EditorJsEditor({ term, setTerm, data: dataPointer }: WidgetProps) {
  const id = useId()
  const ref = useRef<HTMLDivElement & { editor: EditorJS }>(null)

  useEffect(() => {
    rdfToEditorJsOutputData(dataPointer).then(previousValue => {
      if (!ref.current || ref.current.editor) return

      ref.current.editor = new EditorJS({
        holder: id,
        placeholder: 'Add some content...',
        data: previousValue,
        tools: {
          header: Header,
          list: List
        },
        onChange: (api, event) => {
          ref.current?.editor
            .save()
            .then(editorJsOutputDataToRdf)
            .catch(error => {
              console.log('Saving failed: ', error)
            })
        }
      })
    })
  }, [ref])

  return <div id={id} ref={ref}></div>
}
