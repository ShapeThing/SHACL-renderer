import { write } from '@jeswr/pretty-turtle'
import fs from 'fs'
import { expect, test } from 'vitest'
import { ed, prefixes } from '../../core/namespaces'
import { dataToRdf, rdfToData } from './data'

const baseUrl = `file://${process.cwd()}/`

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

test('editor.js data output with shape', async () => {
  const output = await rdfToData({
    data: new URL(`./public/shapes/widgets/editors/editor-js.ttl#editorjsItem`, baseUrl),
    shapes: new URL('./public/shapes/editorjs-output.ttl', baseUrl),
    context: { '@vocab': ed().value }
  })

  expect(output).toStrictEqual({
    'rdf:type': ed('OutputData').value,
    blocks: [
      {
        data: {
          text: 'Lorem'
        },
        id: '9d61vUfGCT',
        type: 'paragraph'
      },
      {
        data: {
          text: 'Ipsum'
        },
        id: 'pK4nbVeBqp',
        type: 'paragraph'
      }
    ],
    time: 1234,
    version: '13'
  })
})

test.only('rdf output with shape', async () => {
  const shape = fs.readFileSync('./public/shapes/editorjs-output.ttl', 'utf8')

  const data = {
    time: 1732052896004,
    blocks: [
      {
        id: '9d61vUfGCT',
        type: 'paragraph',
        data: {
          text: 'Lorem'
        }
      },
      {
        id: 'pK4nbVeBqp',
        type: 'paragraph',
        data: {
          text: 'Ipsum'
        }
      },
      {
        id: '8xA8tKBIw9',
        type: 'paragraph',
        data: {
          text: 'asda'
        }
      }
    ],
    version: '2.30.7'
  }

  const output = await dataToRdf({
    data,
    shapes: shape,
    context: { '@vocab': ed().value }
  })

  const serializedOutput = await write([...output], { prefixes })
  expect(serializedOutput).toBe(`@prefix ed: <https://editorjs.io/> .

<#> ed:version "2.30.7" ;
  ed:blocks [
    ed:id "9d61vUfGCT" ;
    ed:type "paragraph" ;
    ed:data [
      ed:text "Lorem"
    ]
  ], [
    ed:id "pK4nbVeBqp" ;
    ed:type "paragraph" ;
    ed:data [
      ed:text "Ipsum"
    ]
  ], [
    ed:id "8xA8tKBIw9" ;
    ed:type "paragraph" ;
    ed:data [
      ed:text "asda"
    ]
  ] .
`)
})
