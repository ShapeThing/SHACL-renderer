import factory from '@rdfjs/data-model'
import { Quad, Quad_Object, Term } from '@rdfjs/types'
import { Grapoi } from 'grapoi'
import ValidationReport from 'rdf-validate-shacl/src/validation-report'
import { useContext, useState } from 'react'
import IconPlus from '~icons/iconoir/plus'
import { mainContext } from '../../core/main-context'
import { dash, sh } from '../../core/namespaces'
import { scoreWidgets } from '../../core/scoreWidgets'
import { TouchableTerm } from '../../helpers/touchableRdf'
import { widgetsContext } from '../../widgets/widgets-context'
import PropertyElement from '../PropertyElement'
import PropertyObjectEditMode from './PropertyObjectEditMode'
import { createAddObject } from './createAddObject'

type PropertyShapeEditModeProps = {
  property: Grapoi
  data: Grapoi
  facetSearchData: Grapoi
  nodeDataPointer: Grapoi
  path: any
  errors?: ValidationReport['results']
}

export default function PropertyShapeEditMode(props: PropertyShapeEditModeProps) {
  const { property, nodeDataPointer, errors, path } = props
  const { editors } = useContext(widgetsContext)
  const { jsonLdContext } = useContext(mainContext)

  const [items, setItems] = useState(() => nodeDataPointer.executeAll(path))

  const addObject = createAddObject(editors, property, items, nodeDataPointer, setItems)

  const maxCount = property.out(sh('maxCount')).value
    ? parseInt(property.out(sh('maxCount')).value.toString())
    : Infinity

  const emptyFallback = !items.ptrs.length ? scoreWidgets(editors, items, property, dash('editor')) : null

  return (
    <PropertyElement cssClass={errors?.length ? 'has-error' : ''} property={property}>
      <div className="editors">
        {items.map((item: Grapoi) => {
          const itemErrors = errors?.filter((error: any) => error.value?.term.equals(item.term)) ?? []
          const errorMessages = itemErrors.flatMap(error =>
            error.message
              .map((message: any) => message.value)
              .map((message: string) => {
                const IRIs = [...message.matchAll(/\<(.*)\>/g)].map(iriMatch => iriMatch[1])
                const compactedIRIs = IRIs.map(IRI => [IRI, jsonLdContext.compactIri(IRI, true)])
                for (const [expanded, compacted] of compactedIRIs) {
                  message = message.replaceAll(
                    `<${expanded}>`,
                    `<span class="iri" title="${expanded}">${compacted}</span>`
                  )
                }
                return message
              })
          )

          return (
            <PropertyObjectEditMode
              {...props}
              data={item}
              items={items}
              errors={errorMessages}
              setTerm={(term: Term) => {
                const dataset = item.ptrs[0].dataset
                const [quad] = [...item.quads()]
                if (quad.object.equals(term)) return
                dataset.delete(quad)
                dataset.add(factory.quad(quad.subject, quad.predicate, term as Quad_Object, quad.graph))

                setItems(() => nodeDataPointer.executeAll(path))
              }}
              deleteTerm={() => {
                const dataset = item.ptrs[0].dataset
                const [quad] = [...item.quads()]
                dataset.delete(quad)

                const findDescendants = (subject: Term): Quad[] => {
                  if (!['BlankNode', 'NamedNode'].includes(subject.termType)) return []
                  const descendants = dataset.match(subject)
                  return [...descendants, ...[...descendants].flatMap((quad: Quad) => findDescendants(quad.object))]
                }

                const allDescendants = findDescendants(quad.object)
                for (const descendent of allDescendants) dataset.delete(descendent)
                dataset.delete(quad)

                setItems(() => nodeDataPointer.executeAll(path))
              }}
            />
          )
        })}

        {emptyFallback && emptyFallback.meta.showIfEmpty ? (
          <emptyFallback.Component
            setTerm={(term: Term) => {
              ;(term as TouchableTerm).touched = false
              items.addOut(path[0].predicates[0], term)
              setItems(() => nodeDataPointer.executeAll(path))
            }}
          />
        ) : null}

        {items.ptrs.length < maxCount ? (
          <button className="button icon secondary add-object" onClick={() => addObject()}>
            <IconPlus />
          </button>
        ) : null}
      </div>
    </PropertyElement>
  )
}
