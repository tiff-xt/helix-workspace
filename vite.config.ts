import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

/**
 * GitHub Pages serves a project site from https://<user>.github.io/<repo>/,
 * so production assets need the repo name as their base path.
 *
 * - Locally (`npm run dev`) the base is `/`.
 * - In CI, the deploy workflow sets BASE_PATH from the repository name, so
 *   renaming the repo needs no code change.
 * - For a manual build, change REPO_NAME below or run `BASE_PATH=/my-repo/ npm run build`.
 */
const REPO_NAME = 'helix-workspace'

export default defineConfig(({ command, isPreview }) => ({
  base: command === 'serve' && !isPreview ? '/' : (process.env.BASE_PATH ?? `/${REPO_NAME}/`),
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
}))
