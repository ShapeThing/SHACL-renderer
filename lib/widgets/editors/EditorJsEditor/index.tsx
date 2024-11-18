import EditorJS, { OutputData } from '@editorjs/editorjs'
import Header from '@editorjs/header'
import List from '@editorjs/list'
import datasetFactory from '@rdfjs/dataset'
import { Grapoi } from 'grapoi'
import jsonld from 'jsonld'
import { useEffect, useId, useRef } from 'react'
import { outAll } from '../../../helpers/outAll'
import { WidgetProps } from '../../widgets-context'

const editorJsOutputDataToRdf = async (outputData: OutputData) => {
  console.log(outputData)
  const preparedData = {
    '@context': { '@vocab': 'https://editorjs.io/' },
    '@type': 'https://editorjs.io/OutputData',
    version: outputData.version,
    time: outputData.time,
    // We convert it to an ordered list because JSON supports this and RDF does not.
    blocks: { '@list': outputData.blocks }
  }
  const quads = await jsonld.toRDF(preparedData)
  console.log(quads)
}

const rdfToEditorJsOutputData = async (pointer: Grapoi) => {
  const quads = outAll(pointer.distinct().out())
  const dataset = datasetFactory.dataset(quads)
  const document = await jsonld.fromRDF(dataset, { useNativeTypes: true })
  // const compacted = await jsonld.compact(document, { '@vocab': 'https://editorjs.io/' })
  console.log(document)
  // const test = await jsonld.toRDF(compacted)
}

export default function EditorJsEditor({ term, setTerm, data }: WidgetProps) {
  const id = useId()
  const ref = useRef<HTMLDivElement & { editor: EditorJS }>(null)

  rdfToEditorJsOutputData(data)

  useEffect(() => {
    if (!ref.current || ref.current.editor) return
    ref.current.editor = new EditorJS({
      holder: id,
      placeholder: 'Add some content...',
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
  }, [ref])

  return <div id={id} ref={ref}></div>
}
