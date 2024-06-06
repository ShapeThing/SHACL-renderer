import { ReactNode } from 'react'

type CommaListProps = {
  items: ReactNode[]
}

export default function CommaList({ items }: CommaListProps) {
  const returnList: ReactNode[] = []

  for (const [index, item] of items.entries()) {
    returnList.push(item)
    if (index + 1 < items.length) returnList.push(', ')
  }

  return returnList
}
