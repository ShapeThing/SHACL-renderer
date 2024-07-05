import factory from '@rdfjs/data-model'
import { Grapoi } from 'grapoi'
import { sh, stsr, xsd } from '../../../core/namespaces'

export const iri = stsr('NumberFieldEditor')

export const score = (data?: Grapoi, propertyShape?: Grapoi) => {
  if (
    data &&
    data.term &&
    data.term.value &&
    data.term.termType === 'Literal' &&
    (xsd('integer').equals(data.term.datatype) || xsd('decimal').equals(data.term.datatype))
  ) {
    return 10
  }

  if (
    propertyShape &&
    (xsd('integer').equals(propertyShape.out(sh('datatype')).term) ||
      xsd('decimal').equals(propertyShape.out(sh('datatype')).term))
  ) {
    return 5
  }
}

export const createTerm = () => factory.literal('', xsd('decimal'))
