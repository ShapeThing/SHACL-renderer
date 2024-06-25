import { Grapoi } from 'grapoi'
import { rdf, sh, stf, xsd } from '../../../core/namespaces'

export const iri = stf('TextFieldFacet')

export const score = (data?: Grapoi, property?: Grapoi) => {
  if (1 === 1) return -1

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

  if (property && xsd('string').equals(property.out(sh('datatype')).term)) {
    return 5
  }
}
