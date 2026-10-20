import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    // Forces Vite to use standard bundling instead of optional native binaries
    transformer: 'postcss',
  },
})