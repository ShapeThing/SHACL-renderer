export const needsHttpProxy = async (url: string) => {
  let needsProxy = false
  try {
    await fetch(url)
  } catch {
    needsProxy = true
  }
  return needsProxy
}
