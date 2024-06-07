import factory from '@rdfjs/data-model'
import { rdf, sh, stf, xsd } from '../../../core/namespaces'

export const iri = stf('TextFieldFacet')

export const score = (data: GrapoiPointer, propertyShape: GrapoiPointer) => {
  if (1 === 1) return -1

  if (
    data.term &&
    data.term.value &&
    data.term.termType === 'Literal' &&
    !rdf('langString').equals(data.term.datatype) &&
    !xsd('boolean').equals(data.term.datatype)
  ) {
    return 10
  }

  if (xsd('string').equals(propertyShape.out(sh('datatype')).term)) {
    return 5
  }
}

export const createTerm = () => factory.literal('')
