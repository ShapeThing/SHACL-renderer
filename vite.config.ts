import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import topLevelAwait from 'vite-plugin-top-level-await'
import { dependencies } from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [topLevelAwait(), react(), dts({ include: ['lib'] })],
  build: {
    copyPublicDir: false,
    lib: {
      entry: './lib/index.tsx',
      name: 'ShaclRenderer',
      formats: ['es'],
      fileName: 'shacl-renderer'
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
        additionalData: `@import "./lib/scss/style.scss";`,
        api: 'modern-compiler'
      }
    }
  }
})
