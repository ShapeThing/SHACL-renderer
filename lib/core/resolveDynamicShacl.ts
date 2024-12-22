import { DatasetCore } from '@rdfjs/types'
import { Grapoi } from 'grapoi'
import { Store } from 'n3'
import { nonNullable } from '../helpers/nonNullable'
import { sh } from './namespaces'

export async function resolveDynamicShacl(shapePointer: Grapoi, dataset: DatasetCore) {
  const dynamicIns = shapePointer.node().out(sh('in')).hasOut(sh('select'))
  if (!dynamicIns.ptrs.length) return

  const { QueryEngine } = await import('@comunica/query-sparql')
  const engine = new QueryEngine()

  for (const dynamicIn of dynamicIns) {
    const query = dynamicIn.out(sh('select')).value
    if (!query) continue

    const response = await engine.queryBindings(query, { sources: [new Store([...dataset])] })
    const bindings = await response.toArray()
    const values = bindings.map(binding => binding.get('value'))
    const dedupedValues = [...new Map(values.map(value => [value?.value, value])).values()]
    const property = dynamicIn.in(sh('in'))
    property.deleteList(sh('in'))
    property.addList(sh('in'), dedupedValues.filter(nonNullable))
  }

  // console.log(await write([...(shapePointer.dataset as DatasetCore)], { prefixes }))
  // console.log(await write([...(dataset as DatasetCore)], { prefixes }))
}
