import { useState } from 'react'

export type ImageProps = {
  url: string | URL
  className?: string
  width?: number
  height?: number
  size?: number
}

export default function Image({ url, width, height, className, size }: ImageProps) {
  const searchParams = new URLSearchParams()
  const [hasFirstError, setHasFirstError] = useState(!url.toString().startsWith('http'))
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
