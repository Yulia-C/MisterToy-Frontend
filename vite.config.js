import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'development' ? '/' : '/MisterToy-Frontend/', build: {
    rollupOptions: {
      input: './index.html'
    }
  }
}))