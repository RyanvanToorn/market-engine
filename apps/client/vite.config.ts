import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@market-engine/types': path.resolve(import.meta.dirname, '../../packages/types/index.ts'),
      '@market-engine/utils': path.resolve(import.meta.dirname, '../../packages/utils'),
    },
  },
})
