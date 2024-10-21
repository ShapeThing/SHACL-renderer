import factory from '@rdfjs/data-model'
import datasetFactory from '@rdfjs/dataset'
import debounce from 'lodash-es/debounce'
import ValidationReport from 'rdf-validate-shacl/src/validation-report'
import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react'
import { Validator } from 'shacl-engine'
import parsePath from 'shacl-engine/lib/parsePath'
import { outAll } from '../helpers/outAll'
import { mainContext } from './main-context'
import { sh, stsr } from './namespaces'

export const validationContext = createContext<{ report: ValidationReport | undefined; validate: () => void }>({
  report: undefined,
  validate: () => null
})

export default function ValidationContextProvider({ children }: { children: ReactNode }) {
  const [report, setReport] = useState<ValidationReport | undefined>(undefined)
  const { data, shapes, shapePointer, dataPointer } = useContext(mainContext)
  const [validator] = useState(() => new Validator(shapes, { factory }))

  const validate = useCallback(
    debounce(async () => {
      const properties = shapePointer.out(sh('property'))
      const dataset = datasetFactory.dataset([...data])

      for (const property of properties) {
        const endpoint = property.out(stsr('endpoint')).value

        if (endpoint) {
          const shapeQuads = outAll(property.out().distinct().out())

          const importShaclNodeFilterData = (await import('./importShaclNodeFilterData')).importShaclNodeFilterData
          const path = parsePath(property.out(sh('path')))

          const term = dataPointer.executeAll(path)

          await importShaclNodeFilterData({
            dataset,
            endpoint,
            focusNode: term.term,
            shapeQuads
          })
        }
      }

      const report = await validator.validate({ dataset })
      setReport(report)
    }, 100),
    []
  )

  useEffect(() => {
    validate()
  }, [])

  return <validationContext.Provider value={{ report, validate }}>{children}</validationContext.Provider>
}
