import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Em desenvolvimento, chamadas para /api vão para o FastAPI (porta 8000).
// Assim não há problema de CORS enquanto você programa.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
