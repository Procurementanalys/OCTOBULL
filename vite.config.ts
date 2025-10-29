import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: This path must match your GitHub repository name exactly.
  // This tells Vite where the assets will be located on the server.
  base: '/OCTOBULL/', 
})
