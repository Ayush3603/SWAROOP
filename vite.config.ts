import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// FacePay — Vite config.
// face-api model files live in /public/models and are served at /models at runtime.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
  build: {
    target: 'es2020',
    sourcemap: false,
  },
})
