import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import mkcert from 'vite-plugin-mkcert'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    mkcert(),
    nodePolyfills({
      include: ['buffer']
    }),
    react()
  ],
  // This is here for the build:storybook
  build: {
    target: 'esnext'
  },
  server: {
    https: {}
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    }
  },
  resolve: {
    alias: {
      'node:events': 'events'
    }
  },
  optimizeDeps: {
    include: ['memory-level']
  }
})
