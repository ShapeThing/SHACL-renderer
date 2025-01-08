import { language } from '@rdfjs/score'
import { Grapoi } from 'grapoi'
import { dash, rdfs, schema, sh } from '../../../core/namespaces'
import { WidgetMeta } from '../../widgets-context'

export default {
  iri: dash('LabelViewer'),
  score: (data?: Grapoi, property?: Grapoi) => {
    if (data && data.terms && data.terms[0]?.termType === 'NamedNode') {
      const term = data.terms[0]

      const label =
        data
          ?.node(term)
          .out([sh('name'), rdfs('label'), schema('name')])
          .best(language(['*']))?.value ??
        property
          ?.node(term)
          .out([sh('name'), rdfs('label'), schema('name')])
          .best(language(['*']))?.value

      if (label) return 5
      return 1
    }
  }
} satisfies WidgetMeta
