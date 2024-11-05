import fs from 'fs'
import { expect, test } from 'vitest'
import data from './data'

test('data output', async () => {
  const john = fs.readFileSync('./public/john.ttl', 'utf8')
  const shape = fs.readFileSync('./public/shapes/contact-closed.ttl', 'utf8')

  const output = await data({
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
    birthDate: '1947-01-14',
    child: ['Anna', 'Lisa', 'John jr'],
    familyName: 'Doe',
    favoriteColor: '#ff33ff',
    givenName: ['Hendrik', 'Jan'],
    icon: ['line-md:buy-me-a-coffee-twotone'],
    isHuman: 'true'
  })
})
