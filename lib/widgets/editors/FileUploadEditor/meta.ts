import factory from '@rdfjs/data-model'
import { Term } from '@rdfjs/types'
import { stsr } from '../../../core/namespaces'
import { WidgetMeta } from '../../widgets-context'

export default {
  iri: stsr('FileUploadEditor'),
  shouldDisplay: (term: Term, index: number) => index === 0 || !!term.value,
  createTerm: () => factory.literal(''),
  hideAddButton: true
} satisfies WidgetMeta
