/// <reference types="vitest" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import { fileURLToPath } from 'url'

// https://vitejs.dev/config/
export default defineConfig({
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
  test: {
    coverage: {
      enabled: true
    }
  }
})
