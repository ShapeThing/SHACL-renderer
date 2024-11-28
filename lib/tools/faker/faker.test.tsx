import fs from 'fs'
import { expect, test } from 'vitest'
import { generateFake } from './faker'

test('faker output', async () => {
  const shape = fs.readFileSync('./public/shapes/contact-closed.ttl', 'utf8')

  const fakeItem = await generateFake({
    shapes: shape
  })

  expect(typeof fakeItem[0].object.value === 'string')
})
