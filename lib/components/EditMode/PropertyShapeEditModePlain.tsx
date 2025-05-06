import factory from '@rdfjs/data-model'
import type { Quad_Object, Term } from '@rdfjs/types'
import type ValidationReport from 'rdf-validate-shacl/src/validation-report'
import { useContext } from 'react'
import { mainContext } from '../../core/main-context'
import { sh } from '../../core/namespaces'
import { validationContext } from '../../core/validation/validation-context'
import Grapoi from '../../Grapoi'
import { deleteTermAndDescendants } from '../../helpers/deleteTermAndDescendants'
import parsePath from '../../helpers/parsePath'
import { sortPointersStable } from '../../helpers/sortPointersStable'
import { useLanguageFilteredItems } from '../../hooks/useLanguageFilteredItems'
import PropertyElement from '../PropertyElement'
import { AddButtons } from './AddButtons'
import PropertyObjectEditMode from './PropertyObjectEditMode'
import { getErrorMessages, sortBySortableState, useEmptyTerm } from './PropertyShapeEditMode'
import { splitPointers } from './splitPointers'

type PropertyShapeEditModeProps = {
  property: Grapoi
  data: Grapoi
  facetSearchData: Grapoi
  nodeDataPointer: Grapoi
  path: any
  errors?: ValidationReport['results']
}

export default function PropertyShapeEditModePlain(props: PropertyShapeEditModeProps) {
  const { nodeDataPointer, errors, path } = props
  const { jsonLdContext, data: dataset } = useContext(mainContext)
  const { validate } = useContext(validationContext)
  const createEmptyTerm = useEmptyTerm()

  const addObject = (emptyTerm?: Term) => {
    if (!emptyTerm) return

    const path = parsePath(props.property.out(sh('path'))) // TODO support more complex paths
    const firstPathPart = path?.at(-1)
    if (firstPathPart?.predicates && firstPathPart?.predicates?.length > 1)
      throw new Error('Alternative property paths are not yet supported')
    const [predicate] = firstPathPart?.predicates ?? []
    nodeDataPointer.addOut(predicate, emptyTerm)
  }

  const [items, realSetItems] = useLanguageFilteredItems(() => {
    const items = nodeDataPointer.executeAll(path)
    if (items.ptrs.length === 0) addObject(createEmptyTerm(props.property, items))
    return nodeDataPointer.executeAll(path)
  })
  const sortableState = items.map((item: Grapoi) => ({ id: JSON.stringify(item.term), term: item.term }))

  const setItems = () => {
    const oldTerms = items.map((i: Grapoi) => i.term)
    const newItems = nodeDataPointer.executeAll(path)
    sortPointersStable(newItems, oldTerms)
    realSetItems(newItems)
    validate()
  }

  return (
    <PropertyElement
      cssClass={errors?.length ? 'has-error' : ''}
      property={props.property}
      suffix={
        <AddButtons
          property={props.property}
          items={items}
          addTerm={(emptyTerm: Term) => {
            addObject(emptyTerm)
            setItems()
          }}
        />
      }
    >
      <div className="editors">
        {[...items].sort(sortBySortableState(sortableState)).map((item: Grapoi, index: number) => {
          const errorMessages = getErrorMessages(errors ?? [], item.term, jsonLdContext)
          const property = splitPointers(props.property, item)

          return (
            <PropertyObjectEditMode
              {...props}
              property={property}
              key={property.values.join(':') + ':' + index}
              data={item}
              items={items}
              isList={false}
              index={index}
              errors={errorMessages}
              rerenderAfterManipulatingPointer={setItems}
              setTerm={(term: Term) => {
                const quads = [...item.quads()]
                const quad = quads.at(-1)
                if (!quad || quad.object.equals(term)) return
                dataset.delete(quad)
                dataset.add(factory.quad(quad.subject, quad.predicate, term as Quad_Object, quad.graph))
                setItems()
              }}
              deleteTerm={() => {
                deleteTermAndDescendants(item)
                setItems()
              }}
            />
          )
        })}
      </div>
    </PropertyElement>
  )
}
