import factory from '@rdfjs/data-model'
import { Term } from '@rdfjs/types'
import { Grapoi } from 'grapoi'
import { Store } from 'n3'
import { useContext, useEffect, useState } from 'react'
import { rdfs, sh } from '../../../core/namespaces'
import { validationContext } from '../../../core/validation-context'
import { WidgetProps } from '../../widgets-context'

export default function EnumSelectEditor({ property, term, setTerm, dataset }: WidgetProps) {
  const [options, setOptions] = useState<Term[]>([])
  const [labels, setLabels] = useState<Record<string, string>>({})

  const { report } = useContext(validationContext)

  useEffect(() => {
    const usesSparql: Term | undefined = property.out(sh('in')).out(sh('select')).term

    if (!usesSparql) {
      /** @ts-ignore */
      setOptions([...property.out(sh('in')).list()].map((pointer: Grapoi) => pointer.term))
    } else {
      // See https://datashapes.org/dynamic.html
      ;(async () => {
        const { QueryEngine } = await import('@comunica/query-sparql')
        const engine = new QueryEngine()
        const response = await engine.queryBindings(usesSparql.value, { sources: [new Store([...dataset])] })
        const bindings = await response.toArray()

        const newOptions = []
        const newLabels: Record<string, string> = {}

        for (const binding of bindings) {
          const label = binding.get('label')
          const value = binding.get('value')
          if (!value?.value) continue

          newOptions.push(value)
          newLabels[value.value ?? ''] = label?.value ?? ''
        }

        if (newOptions.map(option => option.value).join('') !== options.map(option => option.value).join('')) {
          setOptions(newOptions)
          setLabels(newLabels)
        }
      })()
    }
  }, [report])

  return (
    <select
      className="input"
      value={term.value}
      onChange={event => {
        setTerm(
          options[0].termType === 'NamedNode'
            ? factory.namedNode(event.target.value)
            : factory.literal(event.target.value)
        )
      }}
    >
      {!term.value ? (
        <option disabled value={''}>
          - Pick an option -
        </option>
      ) : null}
      {options.map((term: Term) => {
        const label = property.node(term).out([sh('name'), rdfs('label')]).values[0] ?? labels[term.value]

        return (
          <option key={term.value} value={term.value}>
            {label ?? term.value}
          </option>
        )
      })}
    </select>
  )
}
