import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

// Read the blog slugs straight out of App.jsx so this list never goes stale.
// Every `slug: "..."` in src/App.jsx becomes a prerendered /blog/<slug> page.
function getBlogSlugs() {
  const appPath = fileURLToPath(new URL('./src/App.jsx', import.meta.url))
  const source = readFileSync(appPath, 'utf-8')
  const slugs = new Set()
  const re = /slug:\s*["'`]([^"'`]+)["'`]/g
  let m
  while ((m = re.exec(source)) !== null) {
    slugs.add(m[1])
  }
  return [...slugs]
}

export default defineConfig({
  plugins: [react()],
  ssgOptions: {
    includedRoutes(paths) {
      const staticRoutes = [
        '/',
        '/blog',
        '/growth-marketing',
        '/dashboard-studio',
      ]
      const blogRoutes = getBlogSlugs().map((slug) => `/blog/${slug}`)
      return [...staticRoutes, ...blogRoutes]
    },
    dirStyle: 'nested',
    format: 'esm',
  },
})
