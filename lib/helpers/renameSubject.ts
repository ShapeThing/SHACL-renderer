import factory from '@rdfjs/data-model'
import { DatasetCore, Quad_Subject } from '@rdfjs/types'

export const renameSubject = (dataset: DatasetCore, oldSubject: Quad_Subject, newSubject: Quad_Subject) => {
  const subjectQuads = dataset.match(oldSubject)
  for (const quad of subjectQuads) {
    dataset.add(factory.quad(newSubject, quad.predicate, quad.object, quad.graph))
    dataset.delete(quad)
  }

  const objectQuads = dataset.match(null, null, oldSubject)
  for (const quad of objectQuads) {
    dataset.add(factory.quad(quad.subject, quad.predicate, newSubject, quad.graph))
    dataset.delete(quad)
  }
}
