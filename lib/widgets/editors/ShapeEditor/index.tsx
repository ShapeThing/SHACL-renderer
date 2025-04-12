import { Localized } from '@fluent/react'
import { language } from '@rdfjs/score'
import { NamedNode } from '@rdfjs/types'
import { Grapoi } from 'grapoi'
import { useContext } from 'react'
import AddNestedNodeButton from '../../../components/EditMode/AddNestedNodeButton'
import Icon from '../../../components/various/Icon'
import { languageContext } from '../../../core/language-context'
import { mainContext } from '../../../core/main-context'
import { rdf, sh } from '../../../core/namespaces'
import { WidgetProps } from '../../widgets-context'
import { SortableTree } from './components/SortableTree'
import { TreeItem } from './components/types'
import './styles.scss'

function ShapeEditorInner() {
  const { dataPointer, shapePointer } = useContext(mainContext)
  const { activeInterfaceLanguage } = useContext(languageContext)

  const getItemsByIris = (iris: NamedNode[]) => {
    return iris
      .map(iri => dataPointer.node(iri))
      .map(propertyOrGroup => {
        const localName = propertyOrGroup.term.value.split(/\/|#/g).pop()

        const children = dataPointer
          .node()
          .hasOut(sh('group'), propertyOrGroup.term)
          .map((iris: Grapoi) => getItemsByIris(iris.terms as NamedNode[]))
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
  const initialItems: TreeItem[] = getItemsByIris(firstLevelgroupIris)

  const propertyShapeIri = shapePointer.node().hasOut(sh('path'), sh('path')).in().term
  const groupShapeIri = shapePointer.node().hasOut(sh('targetClass'), sh('PropertyGroup')).term

  return (
    <div className="shape-editor">
      <div className="tree">
        <SortableTree defaultItems={initialItems} collapsible indicator removable />
      </div>

      <header>
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
      </header>
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
