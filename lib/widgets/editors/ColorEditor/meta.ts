import factory from '@rdfjs/data-model'
import colorParse from 'color-parse'
import Grapoi from '../../../Grapoi'
import { dash, sh, stsr } from '../../../core/namespaces'
import { TouchableTerm } from '../../../helpers/touchableRdf'
import { WidgetMeta } from '../../widgets-context'

export default {
  iri: dash('ColorEditor'),
  createTerm: () => factory.literal('', stsr('color')),
  score: (data?: Grapoi, propertyShape?: Grapoi) => {
    const term = data?.terms[0]

    if (
      term &&
      (term.value || (term as TouchableTerm).touched === false) &&
      term.termType === 'Literal' &&
      (['rgb', 'cmyk'].includes(colorParse(term.value).space) || term.datatype.equals(stsr('color')))
    ) {
      return 2
    }

    if (propertyShape && stsr('color').equals(propertyShape.out(sh('datatype')).term)) {
      return 5
    }
  }
} satisfies WidgetMeta
