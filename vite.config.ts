import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { dependencies } from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: './lib/index.tsx',
      name: 'ShaclRenderer',
      formats: ['es'],
      fileName: 'shacl-renderer'
    },
    target: 'esnext',
    rollupOptions: {
      external: Object.keys(dependencies),
      output: {
        exports: 'named',
        sourcemapExcludeSources: true
      }
    },
    sourcemap: true,
    minify: false
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    }
  }
})
