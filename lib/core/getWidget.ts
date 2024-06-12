import { dash, stf } from './namespaces'

const widgetPredicates = {
  editors: dash('editor'),
  viewers: dash('viewer'),
  facets: stf('facet')
}

export const getWidget = (type: keyof typeof widgetPredicates, property: GrapoiPointer, data: GrapoiPointer) => {
  return null
}
