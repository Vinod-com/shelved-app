import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base is set to "/<repo-name>/" automatically by the GitHub Actions
// workflow (see .github/workflows/deploy.yml) since project pages are
// served from https://<user>.github.io/<repo-name>/. Locally it falls
// back to "/".
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || '/',
})
