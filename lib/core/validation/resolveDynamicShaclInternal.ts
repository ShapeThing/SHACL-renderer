import { DatasetCore } from '@rdfjs/types'
import { Store } from 'n3'
import Grapoi from '../../Grapoi'
import { nonNullable } from '../../helpers/nonNullable'
import { sh, stsr } from '../namespaces'

export async function resolveDynamicShaclInternal(shapePointer: Grapoi, dataset: DatasetCore) {
  const dynamicIns = shapePointer.node().out(sh('in')).hasOut(sh('select'))
  if (!dynamicIns.ptrs.length) return

  const { QueryEngine } = await import('@comunica/query-sparql')
  const engine = new QueryEngine()

  for (const dynamicIn of dynamicIns) {
    const query = dynamicIn.out(sh('select')).value
    const endpoint = dynamicIn.out(stsr('endpoint')).term
    if (!query) continue

    const response = await engine.queryBindings(query, {
      sources: [new Store(endpoint?.value ? [endpoint.value] : [...dataset])]
    })
    const bindings = await response.toArray()
    const values = bindings.map((binding: any) => binding.get('value'))
    const dedupedValues = [...new Map(values.map((value: any) => [value?.value, value])).values()]
    const property = dynamicIn.in(sh('in'))
    property.deleteList(sh('in'))
    property.addList(sh('in'), dedupedValues.filter(nonNullable) as any)
  }
}
