import factory from '@rdfjs/data-model'
import Grapoi from '../../../Grapoi'
import { dash, sh } from '../../../core/namespaces'
import { WidgetMeta } from '../../widgets-context'

export default {
  iri: dash('DetailsEditor'),
  createTerm: ({}, property) => {
    const nodeKind = property?.out(sh('nodeKind')).term
    if (nodeKind?.equals(sh('IRI'))) return factory.namedNode('')
    if (nodeKind?.equals(sh('BlankNode'))) return factory.blankNode()
    return factory.blankNode()
  },
  score: (data?: Grapoi, property?: Grapoi) => {
    // Does not conform to spec.
    if (data && data.term && data.term.termType === 'BlankNode') {
      return 10
    }

    if (property && sh('BlankNode').equals(property.out(sh('nodeKind')).term)) {
      return 50
    }
  }
} satisfies WidgetMeta
