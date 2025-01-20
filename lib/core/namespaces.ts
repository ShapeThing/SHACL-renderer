import namespace from '@rdfjs/namespace'

export const schema = namespace('https://schema.org/')
export const rdfs = namespace('http://www.w3.org/2000/01/rdf-schema#')
export const rdf = namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#')
export const ex = namespace('http://example.com/')
export const sh = namespace('http://www.w3.org/ns/shacl#')
export const dash = namespace('http://datashapes.org/dash#')
export const xsd = namespace('http://www.w3.org/2001/XMLSchema#')
export const stsr = namespace('http://ontology.shapething.com/shacl-renderer#')
export const stf = namespace('http://ontology.shapething.com/facet#')
export const ed = namespace('https://editorjs.io/')
export const owl = namespace('http://www.w3.org/2002/07/owl#')
export const faker = namespace('https://fakerjs.dev/')
export const skos = namespace('http://www.w3.org/2004/02/skos/core#')
export const app = namespace((globalThis.location?.origin ?? 'http://example.com') + '/')

export const prefixes = Object.fromEntries(
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

export const queryPrefixes = Object.entries(prefixes)
  .map(([alias, iri]) => `prefix ${alias}: <${iri}>`)
  .join('\n')
