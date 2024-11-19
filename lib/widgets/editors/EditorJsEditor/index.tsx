import EditorJS, { OutputData } from '@editorjs/editorjs'
import Header from '@editorjs/header'
import List from '@editorjs/list'
import datasetFactory from '@rdfjs/dataset'
import { Grapoi } from 'grapoi'
import { JsonLdContextNormalized } from 'jsonld-context-parser'
import { useContext, useEffect, useId, useRef } from 'react'
import { mainContext } from '../../../core/main-context'
import { ed } from '../../../core/namespaces'
import { outAll } from '../../../helpers/outAll'
import { dataToRdf } from '../../../tools/data/dataToRdf'
import { rdfToData } from '../../../tools/data/rdfToData'
import { WidgetProps } from '../../widgets-context'

const editorJsOutputDataToRdf = async (outputData: OutputData, context: JsonLdContextNormalized) => {
  const quads = await dataToRdf({
    data: outputData,
    shapes: new URL('/shapes/editorjs-output.ttl', location.toString()),
    context: { '@vocab': ed().value }
  })

  // console.log(quads)
}

const rdfToEditorJsOutputData = async (pointer: Grapoi) => {
  const quads = outAll(pointer.distinct().out())

  const data = await rdfToData({
    data: datasetFactory.dataset(quads),
    shapes: new URL('/shapes/editorjs-output.ttl', location.toString()),
    context: { '@vocab': ed().value }
  })

  return data
}

export default function EditorJsEditor({ term, setTerm, data }: WidgetProps) {
  const { jsonLdContext } = useContext(mainContext)
  const id = useId()
  const ref = useRef<HTMLDivElement & { editor: EditorJS }>(null)

  useEffect(() => {
    rdfToEditorJsOutputData(data).then(previousValue => {
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
            .then(data => editorJsOutputDataToRdf(data, jsonLdContext))
            .catch(error => {
              console.log('Saving failed: ', error)
            })
        }
      })
    })
  }, [ref])

  return <div id={id} ref={ref}></div>
}
