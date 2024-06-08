import factory from '@rdfjs/data-model'
import { sh, stf, xsd } from '../../../core/namespaces'

export const iri = stf('DateFacet')

export const score = (data: GrapoiPointer, propertyShape: GrapoiPointer) => {
  if (xsd('date').equals(data.terms[0].datatype)) {
    return 10
  }

  if (xsd('date').equals(propertyShape.out(sh('datatype')).term)) {
    return 5
  }
}

export const createTerm = () => factory.literal('')
