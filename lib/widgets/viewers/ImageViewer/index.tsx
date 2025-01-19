import { useContext, useEffect, useState } from 'react'
import { fetchContext } from '../../../core/fetchContext'
import { WidgetProps } from '../../widgets-context'

export default function ImageViewer({ term }: WidgetProps) {
  const { fetch } = useContext(fetchContext)

  const [url, setUrl] = useState<string>()

  useEffect(() => {
    // Lets try with the custom fetch.
    if (!term.value.startsWith('http')) {
      fetch(term.value).then(async response => {
        const blob = await response.blob()
        const blobUrl = URL.createObjectURL(blob)
        setUrl(blobUrl)
      })
    } else {
      setUrl(term.value)
    }
  }, [term.value])

  return url ? <img src={url} className="viewer image" /> : null
}
