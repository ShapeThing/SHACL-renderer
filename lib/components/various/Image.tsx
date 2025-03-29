import factory from '@rdfjs/data-model'
import { useState } from 'react'
import { useResolveMediaUrl } from '../../hooks/useResolveMediaUrl'

export type ImageProps = {
  url: string | URL
  className?: string
  width?: number
  height?: number
  size?: number
}

export default function Image({ url: givenUrl, width, height, className, size }: ImageProps) {
  console.log(givenUrl)
  const url = useResolveMediaUrl(factory.namedNode(givenUrl.toString())) ?? givenUrl
  const isHttp = url.toString().startsWith('http')

  if (!isHttp) {
    return <img src={url.toString()} className={className} />
  }

  const searchParams = new URLSearchParams()
  const [hasFirstError, setHasFirstError] = useState(false)
  const [hasSecondError, setHasSecondError] = useState(false)
  searchParams.set('url', url.toString())
  searchParams.set('fit', 'cover')
  searchParams.set('a', 'focal')
  searchParams.set('fpy', '0.45')

  if (size) {
    searchParams.set('w', size.toString())
    searchParams.set('h', size.toString())
  }
  if (width) searchParams.set('w', width.toString())
  if (height) searchParams.set('h', height.toString())

  return (
    <img
      onError={() => (!hasFirstError ? setHasFirstError(true) : setHasSecondError(true))}
      className={`${className} ${hasSecondError ? 'has-error' : ''}`}
      src={hasFirstError ? url.toString() : `//wsrv.nl/?${searchParams.toString()}&default=${url}`}
    />
  )
}
