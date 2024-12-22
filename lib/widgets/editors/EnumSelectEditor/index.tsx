import factory from '@rdfjs/data-model'
import { language } from '@rdfjs/score'
import { NamedNode, Quad_Object, Quad_Subject, Term } from '@rdfjs/types'
import { Grapoi } from 'grapoi'
import { Store } from 'n3'
import { useContext, useEffect, useState } from 'react'
import { languageContext } from '../../../core/language-context'
import { rdfs, sh } from '../../../core/namespaces'
import { WidgetProps } from '../../widgets-context'

export default function EnumSelectEditor({ property, term, setTerm, dataset }: WidgetProps) {
  const [options, setOptions] = useState<Term[]>([])
  const { activeInterfaceLanguage } = useContext(languageContext)

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

        for (const binding of bindings) {
          const label = binding.get('label')
          const value = binding.get('value')
          const shapesDataset = property.ptrs[0].dataset

          if (value && label) {
            // We add these labels to the shapes graph.
            shapesDataset.add(factory.quad(value as Quad_Subject, rdfs('label'), label as Quad_Object))
          }
        }
        setOptions([
          ...new Map(bindings.map(binding => [binding.get('value')?.value, binding.get('value') as NamedNode])).values()
        ])
      })()
    }
  }, [])

  return options.length ? (
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
        const label = property
          .node(term)
          .out([sh('name'), rdfs('label')])
          .best(language([activeInterfaceLanguage, ''])).value

        return (
          <option key={term.value} value={term.value}>
            {label ?? term.value}
          </option>
        )
      })}
    </select>
  ) : null
}
