import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: '/MisterToy-Frontend/', 
  // build: {
  //   rollupOptions: {
  //     input: './MisterToy-Frontend/index.html'
  //   }
  // }
}))