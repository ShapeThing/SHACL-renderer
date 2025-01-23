import fs from 'fs'
import { expect, test } from 'vitest'
import { toType } from './type'

test('type output', async () => {
  const shape = fs.readFileSync('./public/shapes/contact-closed.ttl', 'utf8')

  const typeOutput = await toType({
    shapes: shape,
    // targetClass: schema('Person'),
    context: { '@vocab': 'https://schema.org/' }
  })

  expect(typeOutput).toStrictEqual(`export type Person = {
  givenName: Array<string>
  gender?: string
  familyName: string
  favoriteColor?: string
  isHuman?: boolean
  icon?: Array<string>
  knows?: Array<string>
  selfReference?: Array<string>
  birthDate: Date
  child?: Array<string>
  address?: {
    streetAddress: string
    postalCode: string
    addressLocality: string
    addressRegion: string
    addressCountry: string
  }
}`)
})

test('type empty output', async () => {
  const shape = fs.readFileSync('./public/john.ttl', 'utf8')

  const typeOutput = await toType({
    shapes: shape,
    // targetClass: schema('Person'),
    context: { '@vocab': 'https://schema.org/' }
  })

  expect(typeOutput).toStrictEqual(``)
})
