import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  preview: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 8080,
    allowedHosts: true,
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5001'
    }
  }
})
