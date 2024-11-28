import { faker as fakerLibrary } from '@faker-js/faker'
import factory from '@rdfjs/data-model'
import { BlankNode, DatasetCore, NamedNode, Quad, Quad_Object } from '@rdfjs/types'
import { Grapoi } from 'grapoi'
import { initContext } from '../../core/main-context'
import { dash, faker, sh } from '../../core/namespaces'
import { scoreWidgets } from '../../core/scoreWidgets'
import parsePath from '../../helpers/parsePath'
import { coreWidgets } from '../../widgets/coreWidgets'

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
  const activeContentLanguage = Object.keys(mainContext.languages).length ? Object.keys(mainContext.languages)[0] : 'en'
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
    if (!fakerIri) continue

    const generator = getFakerGenerator(fakerIri.substring(20), fakerLibrary)

    const minCount = parseInt(property.out(sh('minCount')).value ?? '0')
    const maxCount = parseInt(property.out(sh('maxCount')).value ?? '10')

    const values = '|'
      .repeat(Math.floor(Math.random() * (maxCount - minCount + 1) + minCount))
      .split('|')
      .map(() => {
        const term = widget!.meta.createTerm!({ activeContentLanguage }, property)
        term.value = generator() as any
        return term
      }) as Quad_Object[]

    values.forEach(value => quads.push(factory.quad(subject, predicate, value)))
  }

  return quads
}
