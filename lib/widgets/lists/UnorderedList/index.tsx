import { ReactNode } from 'react'

type UnorderedListProps = {
  items: ReactNode[]
}

export default function UnorderedList({ items }: UnorderedListProps) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  )
}
