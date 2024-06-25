import { Grapoi } from 'grapoi'
import { sh, stf, xsd } from '../../../core/namespaces'

export const iri = stf('DateFacet')

export const score = (data?: Grapoi, property?: Grapoi) => {
  if (data && data.terms?.[0]?.datatype && xsd('date').equals(data.terms[0].datatype)) {
    return 10
  }

  if (property && xsd('date').equals(property.out(sh('datatype')).term)) {
    return 5
  }
}
