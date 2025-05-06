import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import topLevelAwait from 'vite-plugin-top-level-await'
import { dependencies } from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [topLevelAwait(), react()],
  // This is here for the build:storybook
  build: {
    copyPublicDir: false,
    target: 'esnext',
    rollupOptions: {
      external: Object.keys(dependencies).filter(item => !['grapoi', 'n3', '@hydrofoil/shape-to-query'].includes(item))
    },
    minify: true
  },
  resolve: {
    alias: {
      'node:events': 'events'
    }
  }
})
