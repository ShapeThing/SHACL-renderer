import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import topLevelAwait from 'vite-plugin-top-level-await'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [topLevelAwait(), react()],
  resolve: {
    alias: {
      'node:events': 'events'
    }
  }
})
