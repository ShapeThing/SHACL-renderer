import { Grapoi } from 'grapoi'
import ValidationReport from 'rdf-validate-shacl/src/validation-report'
import { useContext } from 'react'
import IconPlus from '~icons/iconoir/plus'
import { mainContext } from '../../core/main-context'
import { sh } from '../../core/namespaces'
import { widgetsContext } from '../../widgets/widgets-context'
import PropertyElement from '../PropertyElement'
import PropertyObjectEditMode from './PropertyObjectEditMode'
import { createAddObject } from './createAddObject'

type PropertyShapeEditModeProps = {
  property: Grapoi
  data: Grapoi
  facetSearchData: Grapoi
  nodeDataPointer: Grapoi
  errors?: ValidationReport['results']
}

export default function PropertyShapeEditMode(props: PropertyShapeEditModeProps) {
  const { data: items, property, nodeDataPointer, errors } = props
  const { editors } = useContext(widgetsContext)
  const { jsonLdContext } = useContext(mainContext)

  const addObject = createAddObject(editors, property, items, nodeDataPointer)
  if (!items.ptrs.length) addObject()

  const maxCount = property.out(sh('maxCount')).value
    ? parseInt(property.out(sh('maxCount')).value.toString())
    : Infinity

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

          return <PropertyObjectEditMode {...props} data={item} items={items} errors={errorMessages} />
        })}
        {items.ptrs.length < maxCount ? (
          <button className="button icon secondary add-object" onClick={addObject}>
            <IconPlus />
          </button>
        ) : null}
      </div>
    </PropertyElement>
  )
}
