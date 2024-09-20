/// <reference types="vitest" />
import { defineConfig, mergeConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import { sharedConfig } from './vite.config'

// https://vitejs.dev/config/

const libConfig = defineConfig({
    build: {
      lib: {
        entry: resolve(__dirname, 'src/lib.ts'),
        name: 'LoginComponent',
        fileName: 'login-component',
        formats: ['es', 'cjs', 'umd', 'iife']
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

export default defineConfig(mergeConfig(sharedConfig, libConfig))
