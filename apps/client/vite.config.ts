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
      '@screens': path.resolve(import.meta.dirname, 'src/screens'),
      '@theme': path.resolve(import.meta.dirname, 'src/theme'),
      '@context': path.resolve(import.meta.dirname, 'src/context'),
      '@type': path.resolve(import.meta.dirname, 'src/types'),
      '@interfaces': path.resolve(import.meta.dirname, 'src/interfaces'),
    },
  },
})
