import fs from 'fs'
import { expect, test } from 'vitest'
import { xsd } from '../../core/namespaces'
import { generateFake } from './faker'

test('faker output', async () => {
  const shape = fs.readFileSync('./public/shapes/contact-closed.ttl', 'utf8')

  const fakeItem = await generateFake({
    shapes: shape
  })

  const date = fakeItem.find(quad => quad.object.termType === 'Literal' && quad.object.datatype.equals(xsd('date')))

  expect(date?.object.value.split('-').length).toBe(3)
  expect(typeof fakeItem[0].object.value === 'string')
})
