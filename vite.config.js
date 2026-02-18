import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // GitHub Actions では BASE_URL 環境変数、ローカルでは './'
  base: process.env.BASE_URL || './',
})
