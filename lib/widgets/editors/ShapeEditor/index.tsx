import { Localized } from '@fluent/react'
import { language } from '@rdfjs/score'
import { NamedNode } from '@rdfjs/types'
import { useContext } from 'react'
import AddNestedNodeButton from '../../../components/EditMode/AddNestedNodeButton'
import Icon from '../../../components/various/Icon'
import { languageContext } from '../../../core/language-context'
import { mainContext } from '../../../core/main-context'
import { rdf, sh } from '../../../core/namespaces'
import Grapoi from '../../../Grapoi'
import { WidgetProps } from '../../widgets-context'
import { SortableTree } from './components/SortableTree'
import { TreeItem } from './components/types'

const getItemsByIris = (dataPointer: Grapoi, iris: NamedNode[], activeInterfaceLanguage: string) => {
  return iris
    .map(iri => dataPointer.node(iri))
    .map(propertyOrGroup => {
      const localName = propertyOrGroup.term.value.split(/\/|#/g).pop()

      const children = dataPointer
        .node()
        .hasOut(sh('group'), propertyOrGroup.term)
        .map((iris: Grapoi) => getItemsByIris(dataPointer, iris.terms as NamedNode[], activeInterfaceLanguage))
        .flat()

      return {
        label: propertyOrGroup.out(sh('name')).best(language([activeInterfaceLanguage, '', '*'])).value ?? localName,
        id: propertyOrGroup.term.value,
        term: propertyOrGroup.term,
        type: propertyOrGroup.hasOut(sh('path')).term ? 'property' : 'group',
        children
      } as TreeItem
    })
}

function ShapeEditorInner() {
  const { dataPointer, shapePointer } = useContext(mainContext)
  const { activeInterfaceLanguage } = useContext(languageContext)

  const groupsOfProperties = dataPointer.node().out(sh('property')).out(sh('group')).distinct().terms

  // TODO make two visual groups to pick groups from.
  // Groups without fields
  // Groups used in other shapes

  const firstLevelgroupIris = [
    ...dataPointer
      .out(sh('property'))
      .out(sh('group'))
      .filter(property => !property.hasOut(sh('group')).term)
      .distinct().terms,
    ...dataPointer
      .node()
      .hasOut(rdf('type'), sh('PropertyGroup'))
      .distinct()
      .terms.filter(term => !groupsOfProperties.some(property => property.equals(term)))
  ] as NamedNode[]
  const initialItems: TreeItem[] = getItemsByIris(dataPointer, firstLevelgroupIris, activeInterfaceLanguage)

  const propertyShapeIri = shapePointer.node().hasOut(sh('path'), sh('path')).in().term
  const groupShapeIri = shapePointer.node().hasOut(sh('targetClass'), sh('PropertyGroup')).term

  return (
    <div className="shape-editor">
      <div className="tree">
        {/* I do not like the fact that we serialize to JSON and then somehow back to the dataset. What is the right abstraction to sort Grapoi pointers? */}
        <SortableTree
          onChange={items => console.log(items)}
          defaultItems={initialItems}
          collapsible
          indicator
          removable
        />
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
