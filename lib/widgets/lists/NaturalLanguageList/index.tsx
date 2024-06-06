import { ReactNode } from 'react'

type NaturalLanguageListProps = {
  items: ReactNode[]
  locales?: Intl.LocalesArgument
  options?: Intl.ListFormatOptions
}

export default function NaturalLanguageList({ items, locales, options = {} }: NaturalLanguageListProps) {
  const formatter = new Intl.ListFormat(locales, options)

  const list = formatter.formatToParts(items.map(() => 'will be replaced'))

  const returnList: ReactNode[] = []

  let index = 0
  for (const item of list) {
    if (item.type === 'element') {
      returnList.push(items[index])
      index++
    } else {
      returnList.push(item.value)
    }
  }

  return returnList
}
