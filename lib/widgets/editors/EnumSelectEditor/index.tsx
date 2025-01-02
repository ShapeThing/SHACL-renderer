import { Localized } from '@fluent/react'
import factory from '@rdfjs/data-model'
import { language } from '@rdfjs/score'
import { DatasetCore, NamedNode, Quad_Object, Quad_Subject, Term } from '@rdfjs/types'
import { Grapoi } from 'grapoi'
import { Store } from 'n3'
import { useContext, useEffect } from 'react'
import { languageContext } from '../../../core/language-context'
import { rdfs, sh } from '../../../core/namespaces'
import { wrapPromise } from '../../../helpers/wrapPromise'
import { WidgetProps } from '../../widgets-context'

const queries: Map<string, any> = new Map()

const processDynamicShacl = async (query: string, dataset: DatasetCore, shapesDataset: DatasetCore) => {
  const { QueryEngine } = await import('@comunica/query-sparql')
  const engine = new QueryEngine()
  const response = await engine.queryBindings(query, { sources: [new Store([...dataset])] })
  const bindings = await response.toArray()

  for (const binding of bindings) {
    const label = binding.get('label')
    const value = binding.get('value')

    if (value && label) {
      // We add these labels to the shapes graph.
      shapesDataset.add(factory.quad(value as Quad_Subject, rdfs('label'), label as Quad_Object))
    }
  }

  return [
    ...new Map(bindings.map(binding => [binding.get('value')?.value, binding.get('value') as NamedNode])).values()
  ]
}

const getOptions = (property: Grapoi, dataset: DatasetCore, shapesDataset: DatasetCore) => {
  const usesSparql: Term | undefined = property.out(sh('in')).out(sh('select')).term
  const query = usesSparql?.value

  if (query) {
    if (!queries.has(query)) {
      const promise = processDynamicShacl(query, dataset, shapesDataset)
      queries.set(query, wrapPromise(promise))
    }
    return queries.get(query).read()
  } else {
    /** @ts-ignore */
    return [...(property.out(sh('in')).list() ?? [])].map((pointer: Grapoi) => pointer.term)
  }
}

export default function EnumSelectEditor({ property, term, setTerm, dataset }: WidgetProps) {
  const { activeInterfaceLanguage, activeContentLanguage } = useContext(languageContext)
  const options = getOptions(property, dataset, property.ptrs[0].dataset)

  // TODO add a way to clear the queries cache
  useEffect(() => {
    queries.clear()
  }, [activeInterfaceLanguage, activeContentLanguage])

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
          <Localized id="pick-an-option">- Pick an option -</Localized>
        </option>
      ) : null}
      {options.length ? (
        options.map((term: Term) => {
          const label = property
            .node(term)
            .out([sh('name'), rdfs('label')])
            .best(language([activeInterfaceLanguage, activeContentLanguage, '', '*'])).value

          return (
            <option key={term.value} value={term.value}>
              {label ?? term.value.split(/\#|\//g).pop()!}
            </option>
          )
        })
      ) : (
        <option>Loading...</option>
      )}
    </select>
  )
}
