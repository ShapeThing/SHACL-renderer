import factory from '@rdfjs/data-model'
import datasetFactory from '@rdfjs/dataset'
import grapoi from 'grapoi'
import { useContext } from 'react'
import { sh } from '../../core/namespaces'
import { scoreWidgets } from '../../core/scoreWidgets'
import parsePath from '../../helpers/parsePath'
import { widgetsContext } from '../../widgets/widgets-context'
import type { PropertyShapeInnerProps } from '../PropertyShape'

declare global {
  namespace React.JSX {
    interface IntrinsicElements {
      node: any
      item: any
    }
  }
}

export default function PropertyShapeTypeMode(props: PropertyShapeInnerProps) {
  const { property } = props
  const { typings } = useContext(widgetsContext)
  const path = parsePath(property.out(sh('path')))
  if (path[0].predicates.length !== 1) return

  /** @ts-ignore */
  const widgetItem = scoreWidgets(typings, undefined, property)
  const dataset = datasetFactory.dataset()
  const emptyGrapoi = grapoi({ dataset, factory })
  return widgetItem ? <widgetItem.Component {...props} key={property.term.value} data={emptyGrapoi} /> : null
}
