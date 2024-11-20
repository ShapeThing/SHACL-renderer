import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import List from '@editorjs/list'
import datasetFactory from '@rdfjs/dataset'
import { useEffect, useId, useRef } from 'react'
import { ed } from '../../../core/namespaces'
import { outAll } from '../../../helpers/outAll'
import { dataToRdf } from '../../../tools/data/dataToRdf'
import { rdfToData } from '../../../tools/data/rdfToData'
import { WidgetProps } from '../../widgets-context'

const configuration = {
  placeholder: 'Add some content...',
  tools: {
    header: Header,
    list: List
  }
}

const transformationOptions = {
  shapes: new URL('/shapes/editorjs-output.ttl', location.toString()),
  context: { '@vocab': ed().value }
}

export default function EditorJsEditor({ data: dataPointer }: WidgetProps) {
  const id = useId()
  const ref = useRef<HTMLDivElement & { editor: EditorJS }>(null)

  useEffect(() => {
    ;(async () => {
      if (!ref.current || ref.current.editor) return

      const data = datasetFactory.dataset(outAll(dataPointer.distinct().out()))
      const savedValue = await rdfToData({ data, ...transformationOptions })

      ref.current.editor = new EditorJS({
        holder: id,
        data: savedValue,
        ...configuration,
        onChange: async (api, event) => {
          const outputData = await ref.current?.editor.save()
          const rdf = await dataToRdf({ data: outputData, ...transformationOptions })

          console.log(rdf)
        }
      })
    })()

    return () => ref.current?.editor.destroy()
  }, [ref])

  return <div id={id} ref={ref}></div>
}
