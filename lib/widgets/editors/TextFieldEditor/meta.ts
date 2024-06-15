import factory from '@rdfjs/data-model'
import { dash, rdf, sh, xsd } from '../../../core/namespaces'

export const iri = dash('TextFieldEditor')

export const score = (data?: GrapoiPointer, propertyShape?: GrapoiPointer) => {
  if (
    data &&
    data.term &&
    data.term.value &&
    data.term.termType === 'Literal' &&
    !rdf('langString').equals(data.term.datatype) &&
    !xsd('boolean').equals(data.term.datatype)
  ) {
    return 10
  }

  if (propertyShape && xsd('string').equals(propertyShape.out(sh('datatype')).term)) {
    return 5
  }
}

export const createTerm = () => factory.literal('')
