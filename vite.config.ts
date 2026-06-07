import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Projekt publikowany na GitHub Pages pod /<repo>/
  base: '/schemat-elektryczny/',
})
