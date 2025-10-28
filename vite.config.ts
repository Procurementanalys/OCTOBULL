
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: Replace '<YOUR_REPO_NAME>' with the name of your GitHub repository
  // For example, if your repo URL is https://github.com/user/my-app, set base to '/my-app/'
  base: '/<OCTOBULL>/', 
})
