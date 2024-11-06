import { NamedNode } from '@rdfjs/types'

export const constructQueryToSearch = (
  query: string,
  searchTerm: string,
  labelPredicates: NamedNode[],
  limit: number = 20
) => {
  const labelPredicatesString = labelPredicates.map(label => `<${label.value}>`).join(' | ')

  return `${query.substring(0, query.length - 1)}${
    searchTerm
      ? `\n?resource1 ${labelPredicatesString} ?label . FILTER(contains(lcase(?label),"""${searchTerm.toLocaleLowerCase()}"""))\n`
      : ''
  }}
    limit ${limit}
    `
}
