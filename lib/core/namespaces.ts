import namespace from '@rdfjs/namespace'

export const schema = namespace('https://schema.org/')
export const rdfs = namespace('http://www.w3.org/2000/01/rdf-schema#')
export const rdf = namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#')
export const ex = namespace('http://example.com/')
export const ts = namespace('https://centergraph.danielbeeke.nl/turtle-sync#')
export const sh = namespace('http://www.w3.org/ns/shacl#')
export const dash = namespace('http://datashapes.org/dash#')
export const xsd = namespace('http://www.w3.org/2001/XMLSchema#')
export const stsr = namespace('http://ontology.shapething.com/shacl-renderer#')
export const stf = namespace('http://ontology.shapething.com/facet#')

export const prefixes = Object.fromEntries(
  Object.entries({
    schema,
    rdfs,
    rdf,
    ex,
    ts,
    sh,
    dash,
    xsd,
    stsr,
    stf
  }).map(([alias, namespace]) => [alias, namespace('').value])
)
