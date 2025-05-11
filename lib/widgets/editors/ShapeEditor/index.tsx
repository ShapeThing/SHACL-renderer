import { Localized } from '@fluent/react'
import dataFactory from '@rdfjs/data-model'
import { Quad_Subject } from '@rdfjs/types'
import { useContext } from 'react'
import AddNestedNodeButton from '../../../components/EditMode/AddNestedNodeButton'
import SortableStore from '../../../components/SortableStore/SortableStore'
import Icon from '../../../components/various/Icon'
import { mainContext } from '../../../core/main-context'
import { rdf, sh, xsd } from '../../../core/namespaces'
import Grapoi from '../../../Grapoi'
import { WidgetProps } from '../../widgets-context'

const getItems = (dataPointer: Grapoi) => (parent?: Quad_Subject) => {
  // Useful sets
  const topLevelGroups = dataPointer
    .node()
    .hasOut(rdf('type'), sh('PropertyGroup'))
    .filter(group => !group.hasOut(sh('group')).term)
    .distinct()

  const usedGroups = dataPointer.out(sh('property')).out(sh('group')).distinct()
  const unusedGroups = topLevelGroups.filter(group => !usedGroups.terms.some(usedGroup => usedGroup.equals(group.term)))
  const usedTopLevelGroups = usedGroups.filter(usedGroup =>
    topLevelGroups.terms.some(group => group.equals(usedGroup.term))
  )

  const selection = parent
    ? [dataPointer.node().hasOut(sh('group'), parent)]
    : [
        // Properties without groups.
        dataPointer
          .out(sh('property'))
          .filter(property => !property.hasOut(sh('group')).term)
          .distinct(),
        // Groups without groups.
        usedTopLevelGroups
      ]
  return selection
    .flatMap(pointer => pointer.map((innerPointer: Grapoi) => innerPointer))
    .sort((a: Grapoi, b: Grapoi) => {
      const aOrder = parseFloat(a.out(sh('order')).value ?? '0')
      const bOrder = parseFloat(b.out(sh('order')).value ?? '0')
      return aOrder - bOrder
    })
}

const setItems = (_dataPointer: Grapoi) => (items: Grapoi[]) => {
  for (const [index, item] of items.entries()) {
    item.deleteOut(sh('order')).addOut(sh('order'), dataFactory.literal((index + 1).toString(), xsd('integer')))
  }
}

function ShapeEditorInner() {
  const { dataPointer, shapePointer } = useContext(mainContext)

  const propertyShapeIri = shapePointer.node().hasOut(sh('path'), sh('path')).in().term
  const groupShapeIri = shapePointer.node().hasOut(sh('targetClass'), sh('PropertyGroup')).term

  return (
    <div className="shape-editor">
      <div className="tree">
        <SortableStore getItems={getItems(dataPointer)} setItems={setItems(dataPointer)} />
      </div>

      <footer>
        <AddNestedNodeButton shapeIri={groupShapeIri}>
          {onClick => (
            <button onClick={onClick} className="button secondary outline icon">
              <Icon icon="iconoir:plus" />{' '}
              <span>
                <Localized id="add-a-group">Add a group</Localized>
              </span>
            </button>
          )}
        </AddNestedNodeButton>

        <AddNestedNodeButton shapeIri={propertyShapeIri}>
          {onClick => (
            <button onClick={onClick} className="button secondary outline icon">
              <Icon icon="iconoir:plus" />{' '}
              <span>
                <Localized id="add-a-property">Add a property</Localized>
              </span>
            </button>
          )}
        </AddNestedNodeButton>
      </footer>
    </div>
  )
}

export default function ShapeEditor({ useConfigureWidget }: WidgetProps) {
  useConfigureWidget({
    header: () => <ShapeEditorInner />,
    displayCriteria: () => false
  })
  return null
}
