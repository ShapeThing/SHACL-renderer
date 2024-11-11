import factory from '@rdfjs/data-model'
import { stsr } from '../../../core/namespaces'
import { WidgetMeta } from '../../widgets-context'

export default {
  iri: stsr('FileUploadEditor'),
  createTerm: () => factory.literal('')
} satisfies WidgetMeta
