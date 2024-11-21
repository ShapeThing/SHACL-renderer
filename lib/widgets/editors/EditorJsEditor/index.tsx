import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import List from '@editorjs/list'
import datasetFactory from '@rdfjs/dataset'
import { NamedNode } from '@rdfjs/types'
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

export default function EditorJsEditor({ data: dataPointer, dataset, setTerm, term }: WidgetProps) {
  const id = useId()
  const ref = useRef<HTMLDivElement & { editor?: EditorJS }>(null)

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
          const outputData = await ref.current?.editor!.save()
          const newQuads = await dataToRdf({ data: outputData, ...transformationOptions, subject: term as NamedNode })
          const oldQuads = outAll(dataPointer.distinct().out())

          for (const quad of oldQuads) dataset.delete(quad)
          for (const quad of newQuads) dataset.add(quad)

          setTerm(term)
        }
      })
    })()

    return () => {
      ref.current?.editor?.destroy()
      if (ref.current?.editor) delete ref.current.editor
    }
  }, [ref])

  return <div id={id} ref={ref}></div>
}
