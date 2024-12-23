import { FluentBundle, FluentResource } from '@fluent/bundle'
import factory from '@rdfjs/data-model'
import datasetFactory from '@rdfjs/dataset'
import type { BlankNode, DatasetCore, NamedNode } from '@rdfjs/types'
import grapoi, { Grapoi } from 'grapoi'
import { JsonLdContextNormalized } from 'jsonld-context-parser'
import { ReactNode, createContext, useState } from 'react'
import { getShapeSkeleton } from './getShapeSkeleton'
import { rdf, rdfs, sh } from './namespaces'
import { resolveRdfInput } from './resolveRdfInput'

export type MainContextInput = {
  shapes?: URL | DatasetCore | string
  shapeSubject?: URL | string
  data?: URL | DatasetCore | string
  languageMode?: 'tabs' | 'individual'
  facetSearchData?: URL | DatasetCore | string
  subject?: NamedNode | BlankNode
  targetClass?: NamedNode
  contentLanguages?: Record<string, string>
  interfaceLanguages?: Record<string, string>
  cacheId?: string
  context?: Record<string, string>
  onSubmit?: (dataset: DatasetCore, prefixes: Record<string, string>, dataPointer: Grapoi) => void
  children?: (submit: () => void) => ReactNode
  fetch?: (typeof globalThis)['fetch']
} & Settings

export type Settings = {
  mode: 'edit' | 'facet' | 'view' | 'inline-edit'
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
  localizationBundles: Record<string, FluentBundle>
  activeShapePointers: Grapoi
  dataPointer: Grapoi
  facetSearchDataPointer: Grapoi
  jsonLdContext: JsonLdContextNormalized
  languageMode: 'tabs' | 'individual'
  contentLanguages: Record<string, string>
  interfaceLanguages: Record<string, string>
  activeContentLanguage?: string
  activeInterfaceLanguage?: string
  setShapeSubject: (iri: string) => void
  originalInput: MainContextInput
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
  interfaceLanguages: { en: 'English' },
  setShapeSubject: (_iri: string) => null,
  originalInput: null as unknown as MainContextInput,
  localizationBundles: null as unknown as Record<string, FluentBundle>
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
    subject = factory.blankNode()
  }

  return {
    dataPointer: grapoi({ dataset, factory, term: subject }),
    prefixes: resolvedData?.prefixes,
    subject,
    dataset
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

export const createLocalizationBundles = async (languageCodes: string[]) => {
  const translations = languageCodes.map(languageCode =>
    fetch(`/translations/${languageCode}/shacl-renderer.ftl`)
      .then(response => response.text())
      .then(translation => new FluentResource(translation))
      .then(resource => {
        const bundle = new FluentBundle(languageCode)
        bundle.addResource(resource)
        return [languageCode, bundle] as [string, FluentBundle]
      })
  )

  return Object.fromEntries(await Promise.all(translations))
}

/**
 * Creates a new main context. This is a promise, so it should be awaited.
 */
export const initContext = async (originalInput: MainContextInput): Promise<MainContext> => {
  let {
    shapes,
    data,
    facetSearchData,
    subject,
    targetClass: givenTargetClass,
    mode,
    languageMode,
    interfaceLanguages,
    shapeSubject: givenShapeSubject,
    contentLanguages,
    fetch = globalThis['fetch'],
    ...settings
  } = originalInput
  let { dataset, dataPointer, prefixes, subject: finalSubject } = await getData(data, subject, fetch)

  const localizationBundles = await createLocalizationBundles(Object.keys(interfaceLanguages ?? { en: true }))

  const shapesGraph = dataPointer.out(sh('shapesGraph')).term
  const shapesUrl = !shapes && shapesGraph?.value ? new URL(shapesGraph.value, location.toString()) : undefined
  if (!givenShapeSubject && shapesGraph) givenShapeSubject = shapesUrl

  let { shapePointer, resolvedShapes, targetClass, shapePointers, shapeSubject, shapesPointer } = await getShapes(
    fetch,
    shapes ?? shapesUrl,
    givenTargetClass,
    givenShapeSubject
  )

  // This is only for facets, it contains a dataset that we will filter through.
  const facetSearchDataset = facetSearchData
    ? (await resolveRdfInput(facetSearchData, true)).dataset
    : datasetFactory.dataset()
  const facetSearchDataPointer = grapoi({ dataset: facetSearchDataset, factory })
    .hasOut(rdf('type'), targetClass)
    .distinct()

  if (mode === 'facet') {
    // Extract the bare essentials for a shape so that facets can run and add their filters to it.
    dataset = getShapeSkeleton(shapePointer)
    dataPointer = grapoi({ dataset, factory, term: shapePointer.term })
  }

  return {
    shapes: resolvedShapes,
    data: dataset,
    dataPointer,
    subject: finalSubject,
    targetClass,
    facetSearchData: facetSearchDataset,
    shapePointer,
    languageMode: languageMode ?? 'tabs',
    activeShapePointers: shapePointers,
    localizationBundles,
    shapesPointer,
    facetSearchDataPointer,
    shapeSubject: factory.namedNode(shapeSubject.toString()),
    contentLanguages: contentLanguages ?? {},
    interfaceLanguages: interfaceLanguages ?? { en: 'English' },
    jsonLdContext: new JsonLdContextNormalized({ ...(prefixes ?? {}) }),
    mode,
    setShapeSubject: (_iri: string) => null,
    originalInput,
    ...settings
  }
}

export function MainContextProvider({ children, context: givenContext }: MainContextProviderProps) {
  const [context, setContext] = useState(givenContext)

  const setShapeSubject = (iri: string) => {
    initContext({ ...givenContext.originalInput, shapeSubject: new URL(iri) }).then(setContext)
  }

  return context ? (
    <mainContext.Provider value={{ ...context, setShapeSubject }}>{children}</mainContext.Provider>
  ) : null
}
