import factory from '@rdfjs/data-model'
import { Grapoi } from 'grapoi'
import { dash, sh, xsd } from '../../../core/namespaces'

export const iri = dash('TextFieldEditor')

export const score = (data?: Grapoi, propertyShape?: Grapoi) => {
  if (
    data &&
    data.term &&
    data.term.value &&
    data.term.termType === 'Literal' &&
    xsd('boolean').equals(data.term.datatype)
  ) {
    return 10
  }

  if (propertyShape && xsd('boolean').equals(propertyShape.out(sh('datatype')).term)) {
    return 5
  }
}

export const createTerm = () => factory.literal('false', xsd('boolean'))
