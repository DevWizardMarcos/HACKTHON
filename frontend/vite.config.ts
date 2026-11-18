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
        // O backend recusa POSTs de outra origem; em dev fingimos ser a mesma.
        headers: { Origin: 'http://127.0.0.1:8000' },
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
