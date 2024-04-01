/// <reference types="vitest" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import { fileURLToPath } from 'url'

// https://vitejs.dev/config/
export const sharedConfig = defineConfig({
  resolve: {
    alias: {
      '~/': fileURLToPath(new URL('./', import.meta.url))
    }
  },
  plugins: [
    vue(),
    Components({
      resolvers: [IconsResolver()]
    }),
    Icons()
  ],
  optimizeDeps: {
    exclude: ['vue-demi']
  },
  test: {
    coverage: {
      provider: 'v8',
      enabled: true
    }
  }
})

export default sharedConfig
