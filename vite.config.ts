import { defineConfig, type Plugin } from 'vite'
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

/**
 * Preload the Latin Inter subset. Without this the font is only discovered
 * after the CSS downloads, which adds a request to the critical chain.
 */
function preloadLatinFont(): Plugin {
  return {
    name: 'preload-latin-font',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        const font = Object.keys(ctx.bundle ?? {}).find((f) => /inter-latin-wght-normal-.*\.woff2$/.test(f))
        if (!font) return
        return [
          {
            tag: 'link',
            attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: `${ctx.server ? '/' : base}${font}`, crossorigin: '' },
            injectTo: 'head-prepend',
          },
        ]
      },
    },
  }
}

let base = '/'

export default defineConfig(({ command, isPreview }) => {
  base = command === 'serve' && !isPreview ? '/' : (process.env.BASE_PATH ?? `/${REPO_NAME}/`)
  return {
    base,
    plugins: [react(), preloadLatinFont()],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
  }
})
