import fs from 'fs'
import data from './data'
const john = fs.readFileSync('./public/john.ttl', 'utf8')
const shape = fs.readFileSync('./public/shapes/contact-closed.ttl', 'utf8')

const output = await data({
  mode: 'data',
  data: john,
  shapes: shape,
  context: { '@vocab': 'https://schema.org/' }
})

console.log(output)
