import NodeShape from '../../../components/NodeShape'
import { sh } from '../../../core/namespaces'
import { WidgetProps } from '../../widgets-context'

export default function DetailsViewer({ data, property, facetSearchData }: WidgetProps) {
  const node = property.out(sh('node')).term
  const nodeShapePointer = property.node(node)
  return <NodeShape shapePointer={nodeShapePointer} dataPointer={data} facetSearchDataPointer={facetSearchData} />
}
