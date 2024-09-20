import { defineConfig } from 'vite'
import path from 'path'
import { sharedConfig } from './vite.config'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/lib.js'),
      name: 'LoginComponent',
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
  ...sharedConfig()
})
