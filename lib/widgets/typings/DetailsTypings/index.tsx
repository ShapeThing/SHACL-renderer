import factory from '@rdfjs/data-model'
import datasetFactory from '@rdfjs/dataset'
import grapoi, { Grapoi } from 'grapoi'
import { useContext } from 'react'
import NodeShape from '../../../components/NodeShape'
import { mainContext, MainContextProvider } from '../../../core/main-context'
import { rdf, sh } from '../../../core/namespaces'
import parsePath from '../../../helpers/parsePath'
import { WidgetProps } from './../../widgets-context'

export default function DetailsTypings({ data, property, facetSearchData }: WidgetProps) {
  const node = property.out(sh('node')).term
  let nodeShapePointer: Grapoi

  if (!node) {
    const dataset = datasetFactory.dataset([
      factory.quad(factory.namedNode(data?.term.value), rdf('type'), sh('NodeShape'))
    ])
    nodeShapePointer = grapoi({ dataset, factory, term: factory.namedNode(data?.term.value) })
  } else {
    nodeShapePointer = property.node(node)
  }

  const mainContextInstance = useContext(mainContext)
  const targetClass = nodeShapePointer.out(sh('targetClass')).term

  const path = parsePath(property.out(sh('path')))
  const predicate = path[0].predicates[0].value
  const isMultiple = property.out(sh('maxCount')).value !== '1'
  const isRequired = !!parseInt(property.out(sh('minCount')).value)
  const dataType = property.out(sh('datatype')).value

  return (
    <item
      dataType={dataType}
      isRequired={isRequired ? 'true' : 'false'}
      isMultiple={isMultiple ? 'true' : 'false'}
      predicate={predicate}
    >
      <MainContextProvider
        context={{
          ...mainContextInstance,
          targetClass: targetClass ?? mainContextInstance.targetClass,
          shapePointer: nodeShapePointer,
          dataPointer: data?.distinct(),
          facetSearchDataPointer: facetSearchData
        }}
      >
        <NodeShape />
      </MainContextProvider>
    </item>
  )
}
