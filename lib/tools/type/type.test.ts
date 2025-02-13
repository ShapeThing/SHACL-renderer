import fs from 'fs'
import { expect, test } from 'vitest'
import { toType } from './type'

test('type output', async () => {
  const shape = fs.readFileSync('./public/shapes/contact-closed.ttl', 'utf8')

  const typeOutput = await toType({
    shapes: shape,
    context: { '@vocab': 'https://schema.org/' }
  })

  expect(typeOutput?.type).toStrictEqual(`export type Person = {
  iri: string
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
    context: { '@vocab': 'https://schema.org/' }
  })

  expect(typeOutput).toStrictEqual(undefined)
})

test('type output for a shape that contains multilingual strings', async () => {
  const shape = fs.readFileSync('./public/shapes/multilingual.ttl', 'utf8')

  const typeOutput = await toType({
    shapes: shape,
    languageStringsToSingular: true,
    context: { '@vocab': 'https://schema.org/' }
  })

  expect(typeOutput?.type).toStrictEqual(`export type Person = {
  name: string
}`)
})

test.only('type output with a comment', async () => {
  const shape = fs.readFileSync('./public/shapes/comment.ttl', 'utf8')
  const typeOutput = await toType({
    shapes: shape,
    languageStringsToSingular: true,
    context: { '@vocab': 'https://schema.org/' }
  })

  expect(typeOutput?.type).toStrictEqual(`export type Person = {
  /** The given name, often the first name */
  givenName: Array<string>
}`)
})
