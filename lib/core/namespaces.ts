import namespace, { NamespaceBuilder } from '@rdfjs/namespace'

export const schema: NamespaceBuilder<string> = namespace('https://schema.org/')
export const rdfs: NamespaceBuilder<string> = namespace('http://www.w3.org/2000/01/rdf-schema#')
export const rdf: NamespaceBuilder<string> = namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#')
export const ex: NamespaceBuilder<string> = namespace('http://example.com/')
export const sh: NamespaceBuilder<string> = namespace('http://www.w3.org/ns/shacl#')
export const dash: NamespaceBuilder<string> = namespace('http://datashapes.org/dash#')
export const xsd: NamespaceBuilder<string> = namespace('http://www.w3.org/2001/XMLSchema#')
export const stsr: NamespaceBuilder<string> = namespace('http://ontology.shapething.com/shacl-renderer#')
export const stf: NamespaceBuilder<string> = namespace('http://ontology.shapething.com/facet#')
export const ed: NamespaceBuilder<string> = namespace('https://editorjs.io/')
export const owl: NamespaceBuilder<string> = namespace('http://www.w3.org/2002/07/owl#')
export const faker: NamespaceBuilder<string> = namespace('https://fakerjs.dev/')
export const skos: NamespaceBuilder<string> = namespace('http://www.w3.org/2004/02/skos/core#')
export const app: NamespaceBuilder<string> = namespace((globalThis.location?.origin ?? 'http://example.com') + '/')

export const prefixes: Record<string, string> = Object.fromEntries(
  Object.entries({
    schema,
    rdfs,
    rdf,
    ex,
    sh,
    dash,
    xsd,
    stsr,
    stf,
    ed,
    owl,
    faker,
    skos,
    app
  }).map(([alias, namespace]) => [alias, namespace('').value])
)

export const queryPrefixes: string = Object.entries(prefixes)
  .map(([alias, iri]) => `prefix ${alias}: <${iri}>`)
  .join('\n')
