import factory from '@rdfjs/data-model'
import datasetFactory from '@rdfjs/dataset'
import grapoi, { Grapoi } from 'grapoi'
import { useContext } from 'react'
import NodeShape from '../../../components/NodeShape'
import { mainContext, MainContextProvider } from '../../../core/main-context'
import { rdf, sh } from '../../../core/namespaces'
import { WidgetProps } from '../../widgets-context'

export default function DetailsViewer({ data, property, facetSearchData }: WidgetProps) {
  const node = property.out(sh('node')).term
  let nodeShapePointer: Grapoi

  if (!node) {
    const dataset = datasetFactory.dataset([
      factory.quad(factory.namedNode(data.term.value), rdf('type'), sh('NodeShape'))
    ])
    nodeShapePointer = grapoi({ dataset, factory, term: factory.namedNode(data.term.value) })
  } else {
    nodeShapePointer = property.node(node)
  }

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
