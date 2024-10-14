import preact from '@preact/preset-vite'
import Icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact(), Icons({ compiler: 'jsx', jsx: 'react', autoInstall: true })],
  build: {
    target: 'ES2022'
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    }
  }
})
