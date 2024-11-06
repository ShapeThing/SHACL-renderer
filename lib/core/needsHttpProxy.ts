export const needsHttpProxy = async (url: string) => {
  if (sessionStorage.getItem(`needs-http-proxy`)) return !!parseInt(sessionStorage.getItem(`needs-http-proxy`)!)

  let needsProxy = false
  try {
    await fetch(url)
    sessionStorage.setItem(`needs-http-proxy`, '0')
  } catch {
    sessionStorage.setItem(`needs-http-proxy`, '1')
    needsProxy = true
  }
  return needsProxy
}
