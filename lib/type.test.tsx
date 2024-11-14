import fs from 'fs'
import { expect, test } from 'vitest'
import { schema } from './core/namespaces'
import typeOf from './type'

test('type output', async () => {
  const shape = fs.readFileSync('./public/shapes/contact-closed.ttl', 'utf8')

  const typeOutput = await typeOf({
    shapes: shape,
    targetClass: schema('Person'),
    context: { '@vocab': 'https://schema.org/' }
  })

  expect(typeOutput).toStrictEqual(`export type Person = {
  givenName: Array<string>
  familyName: string
  favoriteColor?: string
  isHuman?: boolean
  icon?: Array<string>
  knows?: Array<string>
  selfReference?: Array<string>
  birthDate?: Date
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
