import factory from '@rdfjs/data-model'
import debounce from 'lodash-es/debounce'
import ValidationReport from 'rdf-validate-shacl/src/validation-report'
import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react'
import { Validator } from 'shacl-engine'
import { mainContext } from './main-context'

export const validationContext = createContext<ValidationReport | undefined>(undefined)

export default function ValidationContextProvider({ children }: { children: ReactNode }) {
  const [report, setReport] = useState<ValidationReport | undefined>(undefined)
  const { data, shapes } = useContext(mainContext)

  const [validator] = useState(() => {
    const validator = new Validator(shapes, { factory })
    return validator
  })

  const validate = useCallback(
    debounce(() => validator.validate({ dataset: data }).then(setReport), 100),
    []
  )

  useEffect(() => {
    validate()
  }, [])

  return <validationContext.Provider value={report}>{children}</validationContext.Provider>
}
