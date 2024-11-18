import factory from '@rdfjs/data-model'
import { Grapoi } from 'grapoi'
import { ed, rdf, sh, stsr } from '../../../core/namespaces'
import { WidgetMeta } from '../../widgets-context'

export default {
  iri: stsr('EditorJsEditor'),
  createTerm: () => factory.literal(''),
  score: (data?: Grapoi, propertyShape?: Grapoi) => {
    const isEditorJsData = data?.out(rdf('type')).terms.some(term => term.equals(ed('OutputData')))

    if (isEditorJsData) return 20

    if (propertyShape && ed('OutputData').equals(propertyShape.out(sh('class')).term)) {
      return 10
    }
  }
} satisfies WidgetMeta
