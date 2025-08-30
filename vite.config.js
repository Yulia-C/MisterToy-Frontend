import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/MisterToy-Frontend/',
  build: {
    rollupOptions: {
      input: './index.html'
    }
  }
})