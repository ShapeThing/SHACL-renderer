import ValidationReport from 'rdf-validate-shacl/src/validation-report'

declare module 'shacl-engine' {
    function validate(): ValidationReport
}
