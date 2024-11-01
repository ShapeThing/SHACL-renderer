import '@fontsource/roboto/latin-400.css'
import type { Preview } from '@storybook/preact'
import '../lib/scss/style.scss'

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

export default preview
