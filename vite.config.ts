import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import topLevelAwait from 'vite-plugin-top-level-await'
import { dependencies } from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [topLevelAwait(), react()],
  build: {
    copyPublicDir: false,
    lib: {
      entry: {
        'shacl-renderer': './lib/index.tsx',
        type: './lib/tools/type/type.ts',
        faker: './lib/tools/faker/faker.ts',
        data: './lib/tools/data/data.ts',
        resolveRdfInput: './lib/core/resolveRdfInput.ts'
      },
      name: 'ShaclRenderer',
      formats: ['es']
    },
    target: 'esnext',
    rollupOptions: {
      external: Object.keys(dependencies).filter(
        item => !['grapoi', 'n3', 'multi-range-slider-react', '@hydrofoil/shape-to-query'].includes(item)
      )
    },
    minify: true
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    }
  }
})
