import { faker as fakerLibrary } from '@faker-js/faker'
import factory from '@rdfjs/data-model'
import { BlankNode, DatasetCore, NamedNode, Quad, Quad_Object } from '@rdfjs/types'
import { Grapoi } from 'grapoi'
import { initContext } from '../../core/main-context'
import { dash, faker, rdf, sh, xsd } from '../../core/namespaces'
import { scoreWidgets } from '../../core/scoreWidgets'
import parsePath from '../../helpers/parsePath'
import { coreWidgets } from '../../widgets/coreWidgets'

const cast = (value: any, datatype?: NamedNode) => {
  if (value.termType === 'Literal') return value.value
  if (datatype?.equals(xsd('boolean'))) return value ? 'true' : 'false'
  if (datatype?.equals(xsd('date')))
    return `${value.getFullYear()}-${(value.getMonth() + 1).toString().padStart(2, '0')}-${value
      .getDate()
      .toString()
      .padStart(2, '0')}`
  if (datatype?.equals(xsd('integer'))) return parseInt(value)
  if (datatype?.equals(xsd('decimal'))) return parseFloat(value)
  if (datatype?.equals(xsd('string'))) return value
  if (datatype?.equals(rdf('langString'))) return value
  return value
}

export async function generateFake({
  shapes,
  shapeSubject,
  context: givenContext,
  subject
}: {
  shapes: URL | DatasetCore | string
  shapeSubject?: URL | string
  context?: Record<string, string>
  subject?: NamedNode | BlankNode
}) {
  const mainContext = await initContext({
    shapes,
    shapeSubject,
    context: givenContext,
    mode: 'edit'
  })
  const { shapePointer } = mainContext
  const widgets = coreWidgets
  const activeContentLanguage = Object.keys(mainContext.contentLanguages).length
    ? Object.keys(mainContext.contentLanguages)[0]
    : 'en'
  if (!subject) subject = factory.namedNode('#')
  return nodeShape(shapePointer, widgets, subject, activeContentLanguage)
}

type FakerValue = string | Date | number
type FakerGenerator = () => FakerValue

const getFakerGenerator = (dotSeparatedString: string, pointer: any): FakerGenerator => {
  const parts = dotSeparatedString.split('.')
  for (const part of parts) pointer = pointer[part]
  return pointer as unknown as FakerGenerator
}

const nodeShape = (
  shapePointer: Grapoi,
  widgets: typeof coreWidgets,
  subject: NamedNode | BlankNode,
  activeContentLanguage: string
) => {
  const quads: Quad[] = []

  for (const property of [...shapePointer.out(sh('property'))]) {
    let path = parsePath(property.out(sh('path'))) as any

    const predicate = path[0].predicates[0]
    const widget = scoreWidgets(widgets['editors'], undefined, property, dash('editor'))
    const fakerIri = property.out(faker('generator')).value

    const min = parseInt(property.out(sh('minCount')).value ?? '0')
    const max = parseInt(property.out(sh('maxCount')).value ?? '10')

    let generator: () => any

    if (fakerIri) {
      generator = () => [getFakerGenerator(fakerIri.substring(20), fakerLibrary)()]
    } else if (property.out(sh('in')).term) {
      /** @ts-ignore */
      const list = [...(property.out(sh('in'))?.list() ?? [])].map(pointer => pointer.term)
      generator = () => [fakerLibrary.helpers.arrayElement(list)]
    } else if (property.out(sh('node')).term) {
      generator = () => {
        const node = property.out(sh('node')).term
        const nodeShapePointer = property.node(node)
        const blankNode = factory.blankNode()
        const nestedQuads = nodeShape(nodeShapePointer, widgets, blankNode, activeContentLanguage)
        return [...nestedQuads, factory.quad(subject, predicate, blankNode)]
      }
    } else {
      continue
    }

    for (let index = 0; index < fakerLibrary.number.int({ min, max }); index++) {
      const generatedValues = generator()

      for (const generatedValue of generatedValues) {
        let term: Quad_Object | undefined = undefined

        if (generatedValue.predicate) {
          quads.push(generatedValue)
        } else if (generatedValue?.termType === 'NamedNode') {
          term = generatedValue
        } else {
          term = widget!.meta.createTerm!({ activeContentLanguage }, property) as Quad_Object
          term.value =
            generatedValue?.termType === 'NamedNode'
              ? generatedValue
              : cast(generatedValue, property.out(sh('datatype')).term)
        }

        if (term) quads.push(factory.quad(subject, predicate, term))
      }
    }
  }

  return quads
}
