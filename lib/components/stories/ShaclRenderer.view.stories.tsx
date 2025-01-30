import factory from '@rdfjs/data-model'
import { initContext } from '../../core/main-context'
import { DiffableTerm } from '../../helpers/diffableTerm'
import ShaclRenderer, { schema, ShaclRendererProps } from '../ShaclRenderer'

export default {
  title: 'SHACL Renderer/View',
  component: ShaclRenderer,
  argTypes: {}
}

export const withShape = {
  args: {
    mode: 'view',
    data: new URL('/john.ttl#john', location.origin),
    targetClass: schema('Person'),
    shapes: new URL('/shapes/contact-closed-view.ttl', location.origin)
  } as ShaclRendererProps
}

export const withoutShape = {
  args: {
    mode: 'view',
    data: new URL('/john.ttl#john', location.origin)
  } as ShaclRendererProps
}

const diffContext = {
  mode: 'view',
  data: new URL('/john.ttl#john', location.origin),
  targetClass: schema('Person'),
  shapes: new URL('/shapes/contact-closed-view.ttl', location.origin)
} as ShaclRendererProps

const context = await initContext(diffContext)

const quads = [...context.data]
const subject = quads[0].subject
const graph = quads[0].graph

const addedTerm: DiffableTerm = factory.literal('Hendrik Pieter Doe')
addedTerm.diffState = 'added'
const addedQuad = factory.quad(subject, schema('name'), addedTerm, graph)
const deletedTerm: DiffableTerm = factory.literal('Hendrik Jan Doe')
const deletedQuad = factory.quad(subject, schema('name'), deletedTerm, graph)
deletedTerm.diffState = 'deleted'
context.data.delete(deletedQuad)
context.data.add(deletedQuad)
context.data.add(addedQuad)
export const diff = {
  args: {
    mode: 'view',
    data: context.data,
    targetClass: schema('Person'),
    shapes: new URL('/shapes/contact-closed-view.ttl', location.origin)
  } as ShaclRendererProps
}

export const PersonWithShape = {
  args: {
    mode: 'view',
    data: new URL('/john.ttl#john', location.origin),
    targetClass: schema('Person'),
    shapes: new URL('/shapes/person.ttl', location.origin)
  } as ShaclRendererProps
}

export const oneEnglishTerm = {
  args: {
    mode: 'view',
    data: new URL('/shapes/one-english.ttl', location.origin),
    shapes: new URL('/shapes/multilingual.ttl', location.origin)
  } as ShaclRendererProps
}
