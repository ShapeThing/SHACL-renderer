import { Grapoi } from 'grapoi'
import { dash, sh } from '../../../core/namespaces'

export const iri = dash('BlankNodeViewer')

export const score = (data?: Grapoi, property?: Grapoi) => {
  if (property && !property.out(sh('node')).value) return -1

  if (data && data.term && data.term.termType === 'BlankNode') {
    return 1
  }

  if (property && sh('BlankNode').equals(property.out(sh('nodeKind')).term)) {
    return 1
  }
}
