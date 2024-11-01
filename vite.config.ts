import preact from '@preact/preset-vite'
import { defineConfig } from 'vite'
import { dependencies } from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
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
