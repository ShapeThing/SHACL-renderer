export type ImageProps = {
  url: string | URL
  className?: string
  width?: number
  height?: number
  size?: number
}

export default function Image({ url, width, height, className, size }: ImageProps) {
  const searchParams = new URLSearchParams()
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
      onError={event => (event.target as HTMLImageElement).classList.add('has-error')}
      className={`${className}`}
      src={`//wsrv.nl/?${searchParams.toString()}`}
    />
  )
}
