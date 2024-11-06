import { NamedNode } from '@rdfjs/types'
import { Grapoi } from 'grapoi'
import { rdfs, schema, sh, stsr } from '../core/namespaces'
import parsePath from './parsePath'

export const getPurposePredicates = (nodeShape: Grapoi, purpose: 'label' | 'image') => {
  const purposeProperty = nodeShape.out(sh('property')).hasOut(stsr('purpose'), stsr(purpose))
  const path = parsePath(purposeProperty.out(sh('path')))
  const predicates: NamedNode[] =
    path?.[0]?.predicates ?? (purpose === 'label' ? [rdfs('label'), schema('name')] : [schema('image')])
  return predicates
}
