export const isValidIri = (iri: string) => {
  try {
    new URL(iri)
    return true
  } catch {}
}
