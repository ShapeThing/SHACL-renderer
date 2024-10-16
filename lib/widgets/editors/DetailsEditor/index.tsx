import { useContext } from 'react'
import NodeShape from '../../../components/NodeShape'
import { mainContext, MainContextProvider } from '../../../core/main-context'
import { sh } from '../../../core/namespaces'
import { WidgetProps } from '../../widgets-context'

export default function DetailsEditor({ data, property, facetSearchData }: WidgetProps) {
  const node = property.out(sh('node')).term

  // This is a little trick so we can support data without shapes.
  const nodeShapePointer = node ? property.node(node) : property
  const mainContextInstance = useContext(mainContext)

  return (
    <MainContextProvider
      context={{
        ...mainContextInstance,
        shapePointer: nodeShapePointer,
        dataPointer: data.distinct(),
        facetSearchDataPointer: facetSearchData
      }}
    >
      <NodeShape />
    </MainContextProvider>
  )
}
