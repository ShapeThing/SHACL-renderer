import NodeShape from '../../../components/NodeShape'
import { sh } from '../../../core/namespaces'
import { WidgetProps } from '../../widgets-context'
import './style.scss'

export default function BlankNodeEditor({ data, property, facetSearchData }: WidgetProps) {
  const node = property.out(sh('node')).term
  const nodeShapePointer = property.node(node)
  if (!facetSearchData) debugger
  return <NodeShape shapePointer={nodeShapePointer} dataPointer={data} facetSearchDataPointer={facetSearchData} />
}
