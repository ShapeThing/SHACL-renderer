import colorParse from 'color-parse'
import { Grapoi } from 'grapoi'
import { sh, stsr } from '../../../core/namespaces'
import { TouchableTerm } from '../../../helpers/touchableRdf'
import { WidgetMeta } from '../../widgets-context'

export default {
  iri: stsr('ColorViewer'),
  score: (data?: Grapoi, propertyShape?: Grapoi) => {
    const term = data?.terms[0]

    if (
      term &&
      (term.value || (term as TouchableTerm).touched === false) &&
      term.termType === 'Literal' &&
      (['rgb', 'cmyk'].includes(colorParse(term.value).space) || term.datatype.equals(stsr('color')))
    ) {
      return 3
    }

    if (propertyShape && stsr('color').equals(propertyShape.out(sh('datatype')).term)) {
      return 5
    }
  }
} satisfies WidgetMeta
