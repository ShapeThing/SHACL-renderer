import factory from '@rdfjs/data-model'
import datasetFactory from '@rdfjs/dataset'
import grapoi from 'grapoi'
import { debounce } from 'lodash-es'
import type ValidationReport from 'rdf-validate-shacl/src/validation-report'
import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react'
import { Validator } from 'shacl-engine'
import { TouchableQuad } from '../../helpers/touchableRdf'
import { fetchContext } from '../fetchContext'
import { mainContext } from '../main-context'
import { fetchAdditionalData } from './fetchAdditionalData'
import { resolveDynamicShaclInternal } from './resolveDynamicShaclInternal'

export const validationContext = createContext<{ report: ValidationReport | undefined; validate: () => void }>({
  report: undefined,
  validate: () => null
})

export default function ValidationContextProvider({ children }: { children: ReactNode }) {
  const [report, setReport] = useState<ValidationReport | undefined>(undefined)
  const { data, shapes: originalShapes, shapePointer: originalShapePointer, mode, store } = useContext(mainContext)
  const { fetch } = useContext(fetchContext)

  const [validateOnNextTick, setValidateOnNextTick] = useState(true)

  useEffect(() => {
    if (!validateOnNextTick) return
    if (!['edit'].includes(mode)) return
    setValidateOnNextTick(false)
    ;(async () => {
      // When we validate we need to have a copy of the dataset so we can have support
      // for triples that do not exist in our shapes dataset or our content dataset

      const shapes = datasetFactory.dataset([...originalShapes])
      const validator = new Validator(shapes, { factory })
      const shapePointer = grapoi({ dataset: shapes, factory, terms: originalShapePointer.terms })
      const dataset = datasetFactory.dataset([...data].filter(quad => !('touched' in (quad as TouchableQuad).object)))
      const dataPointer = grapoi({ dataset, factory })

      if (!dataset.size) return

      await fetchAdditionalData(shapePointer, dataset, dataPointer, fetch, store)
      await resolveDynamicShaclInternal(shapePointer, dataset)

      const report = await validator.validate({ dataset }, shapePointer)
      console.log(
        report.results.map((result: any) => {
          return {
            path: result.path,
            focusNode: result.focusNode?.value,
            value: result.value?.value,
            message: result.message[0]?.value
          }
        })
      )
      setReport(report)
    })()
  }, [validateOnNextTick])

  const validate = useCallback(
    debounce(async () => {
      setValidateOnNextTick(true)
    }, 100),
    []
  )

  useEffect(() => {
    if (['edit', 'inline-edit'].includes(mode)) validate()
  }, [mode])

  return <validationContext.Provider value={{ report, validate }}>{children}</validationContext.Provider>
}
