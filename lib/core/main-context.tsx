import factory from '@rdfjs/data-model'
import datasetFactory from '@rdfjs/dataset'
import type { BlankNode, DatasetCore, NamedNode, Quad_Subject } from '@rdfjs/types'
import grapoi, { Grapoi } from 'grapoi'
import { JsonLdContextNormalized } from 'jsonld-context-parser'
import { ReactNode, createContext, useReducer } from 'react'
import { renameSubject as renameSubjectFull } from '../helpers/renameSubject'
import { getShapeSkeleton } from './getShapeSkeleton'
import { prefixes, rdf, rdfs, sh } from './namespaces'
import { resolveRdfInput } from './resolveRdfInput'

const NO_SUBJECT_GIVEN = factory.namedNode('urn:no-subject-given')

export type MainContextInput = {
  shapes?: URL | DatasetCore | string
  shapeSubject?: URL | string
  data?: URL | DatasetCore | string
  languageMode?: 'tabs' | 'individual'
  facetSearchData?: URL | DatasetCore | string
  subject?: NamedNode | BlankNode
  prefixes?: Record<string, string>
  targetClass?: NamedNode
  contentLanguages?: Record<string, Record<string, string>>
  interfaceLanguages?: Record<string, Record<string, string>>
  cacheId?: string
  fallback?: ReactNode
  context?: Record<string, string>
  onSubmit?: (dataset: DatasetCore, prefixes: Record<string, string>, dataPointer: Grapoi, context: MainContext) => void
  children?: (submit: () => void) => ReactNode
  fetch?: (typeof globalThis)['fetch']
} & Settings

export type Settings = {
  mode: 'edit' | 'facet' | 'view'
}

export type MainContext = {
  shapes: DatasetCore
  data: DatasetCore
  facetSearchData: DatasetCore
  subject: NamedNode | BlankNode
  shapeSubject: NamedNode
  targetClass?: NamedNode
  shapePointer: Grapoi
  shapesPointer: Grapoi
  activeShapePointers: Grapoi
  dataPointer: Grapoi
  facetSearchDataPointer: Grapoi
  jsonLdContext: JsonLdContextNormalized
  fallback?: ReactNode
  languageMode: 'tabs' | 'individual'
  contentLanguages: Record<string, Record<string, string>>
  interfaceLanguages: Record<string, Record<string, string>>
  activeContentLanguage?: string
  updates: number
  update: () => void
  activeInterfaceLanguage?: string
  originalInput: MainContextInput
  containsRelativeReferences?: boolean
  renameSubject: (newSubject: Quad_Subject) => void
} & Settings

// The default context because react needs it this way.
export const mainContext = createContext<MainContext>({
  shapes: datasetFactory.dataset(),
  data: datasetFactory.dataset(),
  facetSearchData: datasetFactory.dataset(),
  subject: factory.blankNode(),
  shapeSubject: factory.namedNode(''),
  targetClass: undefined,
  shapePointer: undefined as unknown as Grapoi,
  activeShapePointers: undefined as unknown as Grapoi,
  dataPointer: undefined as unknown as Grapoi,
  shapesPointer: undefined as unknown as Grapoi,
  facetSearchDataPointer: undefined as unknown as Grapoi,
  mode: 'edit',
  jsonLdContext: new JsonLdContextNormalized({}),
  languageMode: 'tabs',
  contentLanguages: {},
  interfaceLanguages: { en: { en: 'English' } },
  renameSubject: () => null,
  updates: 0,
  update: () => null,
  originalInput: null as unknown as MainContextInput
})

type MainContextProviderProps = {
  children?: ReactNode
  context: MainContext
}

/**
 * Fetches the data, returns an empty dataset if no data was given.
 */
const getData = async (
  dataInput?: URL | DatasetCore | string,
  subject?: NamedNode | BlankNode,
  fetch?: (typeof globalThis)['fetch']
) => {
  const resolvedData = dataInput ? await resolveRdfInput(dataInput, false, fetch) : null
  let dataset = resolvedData ? resolvedData.dataset : datasetFactory.dataset()

  if (!subject && dataInput instanceof URL) {
    const localDataName = dataInput?.toString().split('#').pop()
    if (localDataName) subject = factory.namedNode(dataInput.toString())
  }

  const firstQuad = [...dataset]?.[0]
  if (!subject && firstQuad) {
    subject = firstQuad.subject as NamedNode
  } else if (!subject) {
    subject = NO_SUBJECT_GIVEN
  }

  const datasetPrefixes: Record<string, string> = {}
  const temporaryJsonLdContext = new JsonLdContextNormalized(prefixes)
  for (const quad of dataset) {
    const terms = [quad.subject, quad.predicate, quad.object]
    for (const term of terms) {
      if (term.termType === 'NamedNode') {
        const compactedIri = temporaryJsonLdContext.compactIri(term.value)
        if (compactedIri !== term.value) {
          const [prefix] = compactedIri.split(':')
          datasetPrefixes[prefix] = prefixes[prefix]
        }
      }
    }
  }

  return {
    dataPointer: grapoi({ dataset, factory, term: subject }),
    prefixes: { ...resolvedData?.prefixes, ...datasetPrefixes },
    subject,
    dataset,
    containsRelativeReferences: resolvedData?.containsRelativeReferences
  }
}

const getShapeIrisByChildShapeIri = (childIri: NamedNode, shapes: Grapoi, shapeIris: NamedNode[] = []) => {
  const shape = shapes.node(childIri)
  const shapeTargetClass = shape.out(sh('targetClass')).term
  const classDefinition = shape.node(shapeTargetClass)
  const parentClass = classDefinition.out(rdfs('subClassOf')).term
  const parentShape = shapes.node(parentClass).in(sh('targetClass'))

  if (shapes.ptrs.length && parentShape.term && classDefinition.ptrs.length && parentClass) {
    const termIsAlreadyIncluded = shapeIris.find(iri => iri.equals(parentShape.term))
    if (termIsAlreadyIncluded) {
      console.error(`The term "${termIsAlreadyIncluded.value}" was found twice in the class hierarchy`)
      return shapeIris
    }

    shapeIris.push(parentShape.term)
    getShapeIrisByChildShapeIri(parentShape.term, shapes, shapeIris)
  }

  return shapeIris
}

/**
 * Fetches the shape part, can return a generic shape if none was given
 */
const getShapes = async (
  fetch: (typeof globalThis)['fetch'],
  shapes?: URL | DatasetCore | string,
  givenTargetClass?: NamedNode,
  shapeSubject?: URL | string
) => {
  const { dataset: resolvedShapes } = shapes
    ? await resolveRdfInput(shapes, true, fetch)
    : {
        dataset: datasetFactory.dataset([
          factory.quad(factory.namedNode(''), rdf('type'), sh('NodeShape')),
          factory.quad(factory.namedNode(''), sh('targetClass'), givenTargetClass!)
        ])
      }

  const shapesPointer = grapoi({ dataset: resolvedShapes, factory })
  let shapePointers = shapesPointer.hasOut(rdf('type'), sh('NodeShape'))

  // First filter to all the shapes that match with the given target class
  if (givenTargetClass) {
    shapePointers = shapePointers.hasOut(sh('targetClass'), givenTargetClass)
    if (![...shapePointers].length)
      throw new Error(`No shape found for the specified target class ${givenTargetClass.value}`)
  }

  // We allow urls with #[localName]
  const localShapeName =
    (shapes instanceof URL || typeof shapes === 'string') && shapes?.toString().includes('#')
      ? shapes?.toString().split('#').pop()
      : false
  if (!shapeSubject && localShapeName) {
    shapeSubject = [...shapePointers].find(pointer => pointer.term.value.split(/\/|\#/g).pop() === localShapeName)?.term
      .value
  }

  // Last resort, we will grab the first shape that we will find.
  if (!shapeSubject) shapeSubject = shapePointers.terms?.[0]?.value

  // Gather inheritance data
  const parents = getShapeIrisByChildShapeIri(factory.namedNode(shapeSubject.toString()), shapesPointer)
  const shapePointer = shapePointers.filter(pointer =>
    [factory.namedNode(shapeSubject.toString()), ...parents].some(term => term.equals(pointer.term))
  )

  const targetClass: NamedNode | undefined = givenTargetClass

  if (!shapePointer) throw new Error('No shape pointer')

  return {
    shapePointer,
    shapePointers,
    shapesPointer,
    targetClass,
    resolvedShapes,
    shapeSubject
  }
}

/**
 * Creates a new main context. This is a promise, so it should be awaited.
 */
export const initContext = async (originalInput: MainContextInput): Promise<MainContext> => {
  const start = performance.now()
  let {
    shapes,
    data,
    facetSearchData,
    subject,
    targetClass: givenTargetClass,
    mode,
    fallback,
    languageMode,
    prefixes: givenPrefixes,
    interfaceLanguages,
    shapeSubject: givenShapeSubject,
    contentLanguages,
    fetch = globalThis['fetch'],
    ...settings
  } = originalInput
  let {
    dataset,
    dataPointer,
    prefixes,
    subject: finalSubject,
    containsRelativeReferences
  } = await getData(data, subject, fetch)
  const shapesGraph = dataPointer.out(sh('shapesGraph')).term
  const shapesUrl = !shapes && shapesGraph?.value ? new URL(shapesGraph.value, location.toString()) : undefined
  if (!givenShapeSubject && shapesGraph) givenShapeSubject = shapesUrl

  const { shapePointer, resolvedShapes, targetClass, shapePointers, shapeSubject, shapesPointer } = await getShapes(
    fetch,
    shapes ?? shapesUrl,
    givenTargetClass,
    givenShapeSubject
  )

  // This is only for facets, it contains a dataset that we will filter through.
  const facetSearchDataset = facetSearchData
    ? (await resolveRdfInput(facetSearchData, true, fetch)).dataset
    : datasetFactory.dataset()
  const facetSearchDataPointer = grapoi({ dataset: facetSearchDataset, factory })
    .hasOut(rdf('type'), targetClass)
    .distinct()

  if (mode === 'facet') {
    // Extract the bare essentials for a shape so that facets can run and add their filters to it.
    dataset = getShapeSkeleton(shapePointer)
    dataPointer = grapoi({ dataset, factory, term: shapePointer.term })
  }

  // The order of Shapes and data are intertwined. We now have the shapes so we will set the subject definitive.
  if (finalSubject?.equals(NO_SUBJECT_GIVEN) || finalSubject.termType === 'BlankNode') {
    const nodeKind = shapePointer.out(sh('nodeKind')).term
    if (nodeKind?.equals(sh('IRI'))) finalSubject = factory.namedNode('')
    if (nodeKind?.equals(sh('BlankNode'))) finalSubject = factory.blankNode('subject')
    dataPointer = dataPointer.node(finalSubject)
  }

  console.log(`Resolving context took ${performance.now() - start}`)

  return {
    shapes: resolvedShapes,
    data: dataset,
    dataPointer,
    containsRelativeReferences,
    subject: finalSubject,
    targetClass,
    facetSearchData: facetSearchDataset,
    shapePointer,
    languageMode: languageMode ?? 'tabs',
    activeShapePointers: shapePointers,
    fallback,
    shapesPointer,
    facetSearchDataPointer,
    shapeSubject: factory.namedNode(shapeSubject.toString()),
    contentLanguages: contentLanguages ?? {},
    interfaceLanguages: interfaceLanguages ?? { en: { en: 'English' } },
    jsonLdContext: new JsonLdContextNormalized({ ...(prefixes ?? {}), ...(givenPrefixes ?? {}) }),
    mode,
    updates: 0,
    update: () => null,
    renameSubject: () => null,
    originalInput,
    ...settings
  }
}

export function MainContextProvider({ children, context }: MainContextProviderProps) {
  const [updates, update] = useReducer(x => x + 1, 0)

  const renameSubject = (newSubject: Quad_Subject) => {
    if (!newSubject.equals(context.subject)) {
      renameSubjectFull(context.data, context.subject, newSubject)
      context.dataPointer = context.dataPointer.node(newSubject)
      context.subject = newSubject as NamedNode
    }
    update()
  }
  return context ? (
    <mainContext.Provider value={{ ...context, renameSubject, updates, update }}>{children}</mainContext.Provider>
  ) : null
}
