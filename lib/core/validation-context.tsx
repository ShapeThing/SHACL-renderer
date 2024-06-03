import ValidationReport from 'rdf-validate-shacl/src/validation-report'
import { createContext } from "react";

export const validationContext = createContext<ValidationReport | undefined>(undefined)