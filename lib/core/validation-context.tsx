import factory from '@rdfjs/data-model'
import datasetFactory from '@rdfjs/dataset'
import { debounce } from 'lodash-es'
import type ValidationReport from 'rdf-validate-shacl/src/validation-report'
import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react'
import { Validator } from 'shacl-engine'
import parsePath from '../helpers/parsePath'
import { TouchableQuad } from '../helpers/touchableRdf'
import { mainContext } from './main-context'
import { sh, stsr } from './namespaces'

export const validationContext = createContext<{ report: ValidationReport | undefined; validate: () => void }>({
  report: undefined,
  validate: () => null
})

export default function ValidationContextProvider({ children }: { children: ReactNode }) {
  const [report, setReport] = useState<ValidationReport | undefined>(undefined)
  const { data, shapes, shapePointer, dataPointer, mode } = useContext(mainContext)
  const [validator] = useState(() => new Validator(shapes, { factory }))

  const validate = useCallback(
    debounce(async () => {
      const properties = shapePointer.out(sh('property'))
      const dataset = datasetFactory.dataset([...data].filter(quad => !('touched' in (quad as TouchableQuad).object)))

      for (const property of properties) {
        const endpoint = property.out(stsr('endpoint')).value

        if (endpoint) {
          const fetchDataAccordingToProperty = (await import('./fetchDataAccordingToProperty'))
            .fetchDataAccordingToProperty
          const path = parsePath(property.out(sh('path')))
          const dataItemPointer = dataPointer.executeAll(path)
          const additionalQuads = await fetchDataAccordingToProperty({
            nodeShape: property,
            term: dataItemPointer.term,
            endpoint
          })
          for (const quad of additionalQuads) dataset.add(quad)
        }
      }

      const report = await validator.validate({ dataset })
      setReport(report)
    }, 100),
    []
  )

  useEffect(() => {
    if (['edit', 'inline-edit'].includes(mode)) validate()
  }, [mode])

  return <validationContext.Provider value={{ report, validate }}>{children}</validationContext.Provider>
}
