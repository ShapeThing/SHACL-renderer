import preact from '@preact/preset-vite'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  build: {
    target: 'ES2022',
    rollupOptions: {
      output: {
        manualChunks: {
          comunica: ['@comunica/core']
        }
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    }
  }
})
