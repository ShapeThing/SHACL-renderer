import preact from '@preact/preset-vite'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  build: {
    lib: {
      entry: './lib/index.tsx',
      name: 'ShaclRenderer',
      fileName: 'shacl-renderer'
    },
    target: 'ES2022',
    rollupOptions: {
      external: ['react'],
      output: {
        exports: 'named'
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
