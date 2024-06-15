import { dash, sh, xsd } from '../../../core/namespaces'

export const iri = dash('LiteralViewer')

export const score = (data?: GrapoiPointer, propertyShape?: GrapoiPointer) => {
  if (data && data.term && data.term.termType === 'Literal') {
    return 1
  }

  if (propertyShape && xsd('string').equals(propertyShape.out(sh('datatype')).term)) {
    return 1
  }
}
