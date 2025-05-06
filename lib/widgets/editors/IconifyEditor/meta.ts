import factory from '@rdfjs/data-model'
import Grapoi from '../../../Grapoi'
import { sh, stsr } from '../../../core/namespaces'
import { TouchableTerm } from '../../../helpers/touchableRdf'
import { WidgetMeta } from '../../widgets-context'

export default {
  iri: stsr('IconifyEditor'),
  createTerm: () => factory.literal(''),
  score: (data?: Grapoi, propertyShape?: Grapoi) => {
    const term = data?.terms[0]

    if (
      term &&
      (term.value || (term as TouchableTerm).touched === false) &&
      term.termType === 'Literal' &&
      term.datatype.value === 'https://iconify.design'
    ) {
      return 15
    }

    if (propertyShape && propertyShape.out(sh('datatype')).term?.value === 'https://iconify.design') {
      return 10
    }
  }
} satisfies WidgetMeta
