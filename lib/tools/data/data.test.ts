import { write } from '@jeswr/pretty-turtle'
import fs from 'fs'
import { expect, test } from 'vitest'
import { prefixes } from '../../core/namespaces'
import { dataToRdf, rdfToData } from './data'

test('data output with shape', async () => {
  const john = fs.readFileSync('./public/john.ttl', 'utf8')
  const shape = fs.readFileSync('./public/shapes/contact-closed.ttl', 'utf8')

  const output = await rdfToData({
    data: john,
    shapes: shape,
    context: { '@vocab': 'https://schema.org/' }
  })

  expect(output).toStrictEqual({
    address: {
      addressCountry: 'Austria',
      addressLocality: 'Wien',
      addressRegion: 'Wien',
      postalCode: '1220',
      streetAddress: 'Wagramer Strasse 5'
    },
    birthDate: new Date('1947-01-14T00:00:00.000Z'),
    child: ['Anna', 'Lisa', 'John jr'],
    familyName: 'Doe',
    favoriteColor: '#ff33ff',
    givenName: ['Hendrik', 'Jan'],
    icon: ['line-md:buy-me-a-coffee-twotone'],
    isHuman: true,
    knows: ['http://dbpedia.org/resource/Søren_Kierkegaard'],
    selfReference: ['']
  })
})

test('data output without shape', async () => {
  const john = fs.readFileSync('./public/john.ttl', 'utf8')

  const output = await rdfToData({
    data: john,
    context: { '@vocab': 'https://schema.org/' }
  })

  expect(output).toStrictEqual({
    'rdf:type': ['https://schema.org/Person'],
    givenName: ['Hendrik', 'Jan'],
    familyName: ['Doe'],
    name: ['Hendrik Jan Doe'],
    child: ['Anna', 'Lisa', 'John jr'],
    birthDate: [new Date('1947-01-14T00:00:00.000Z')],
    householdMembers: [6],
    icon: ['line-md:buy-me-a-coffee-twotone'],
    selfReference: [''],
    favoriteColor: ['#ff33ff'],
    isHuman: [true],
    knows: ['http://dbpedia.org/resource/Søren_Kierkegaard'],
    address: [
      {
        address: [],
        'rdf:type': ['https://schema.org/PostalAddress'],
        streetAddress: ['Wagramer Strasse 5'],
        postalCode: ['1220'],
        addressRegion: ['Wien'],
        addressLocality: ['Wien'],
        addressCountry: ['Austria']
      }
    ]
  })
})

test.only('rdf output with shape', async () => {
  const shape = fs.readFileSync('./public/shapes/contact-closed.ttl', 'utf8')

  const output = await dataToRdf({
    data: { givenName: 'John', familyName: 'Doe', birthDate: new Date('1947-01-14T00:00:00.000Z') },
    shapes: shape,
    context: { '@vocab': 'https://schema.org/' }
  })

  const serializedOutput = await write(output, { prefixes })
  expect(serializedOutput).toBe(`@prefix schema: <https://schema.org/> .

 schema:givenName "John" ;
  schema:familyName "Doe" ;
  schema:birthDate "1947-01-14"^^<http://www.w3.org/2001/XMLSchema#date> .
`)
})
