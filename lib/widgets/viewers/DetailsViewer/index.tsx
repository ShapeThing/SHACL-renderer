import { useContext } from 'react'
import NodeShape from '../../../components/NodeShape'
import { mainContext, MainContextProvider } from '../../../core/main-context'
import { sh } from '../../../core/namespaces'
import { WidgetProps } from '../../widgets-context'

export default function DetailsViewer({ data, property, facetSearchData }: WidgetProps) {
  const node = property.out(sh('node')).term
  const nodeShapePointer = property.node(node)
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
