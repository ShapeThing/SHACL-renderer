import { use } from 'react'
import { widgetsContext } from '../widgets/widgets-context'

type PropertyShapeProps = {
  property: GrapoiPointer
}

export default function PropertyShape({ property }: PropertyShapeProps) {
  const { editors, viewers, facets } = use(widgetsContext)

  console.log({ editors, viewers, facets })

  return <div className="property" data-term={property.term.value}></div>
}
