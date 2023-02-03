/// <reference types="vitest" />
import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/

const { mergeConfig, loadConfigFromFile } = require('vite')

export default defineConfig(async () => {
  const { config: defaultConfig } = await loadConfigFromFile('./vite.config.ts')
  const libConfig = defineConfig({
    build: {
      lib: {
        entry: resolve(__dirname, 'src/lib.ts'),
        name: 'LoginComponent',
        fileName: 'login-component',
        formats: ['es', 'umd']
      },
      rollupOptions: {
        external: ['vue'],
        output: {
          globals: {
            vue: 'Vue'
          }
        }
      }
    },
    plugins: [dts()]
  })
  return mergeConfig(defaultConfig, libConfig)
})
