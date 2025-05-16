import '@fontsource/roboto/latin.css'
import { uuid } from '@m-ld/m-ld'
import type { Preview } from '@storybook/react'
import '../lib/scss/style.scss'

if (!localStorage.mldId) {
  localStorage.mldId = uuid()
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  }
}

const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('./sw.js', {
        scope: '/'
      })
      if (registration.installing) {
        console.log('Service worker installing')
      } else if (registration.waiting) {
        console.log('Service worker installed')
      } else if (registration.active) {
        console.log('Service worker active')
      }
    } catch (error) {
      console.error(`Registration failed with ${error}`)
    }
  }
}

document.fonts.ready.then(() => {
  registerServiceWorker()
})

export default preview
