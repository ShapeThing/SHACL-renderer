import { ReactNode } from 'react'
import { createRoot } from 'react-dom/client'

export const renderToAsyncBrowser = async (children: ReactNode) => {
  const element = document.createElement('div')
  const root = createRoot(element)
  root.render(children)
  document.body.appendChild(element)

  const promise: Promise<string> = new Promise(resolve => {
    const checkOutput = () => {
      setTimeout(() => {
        if (element.innerHTML) {
          requestAnimationFrame(() => {
            resolve(element.innerHTML)
          })
        } else checkOutput()
      }, 10)
    }

    checkOutput()
  })

  const result = await promise
  element.remove()
  return result
}
