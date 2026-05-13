import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// vite-react-ssg reads this config during build. No extra plugin entry needed —
// running `vite-react-ssg build` (see package.json) does the prerendering.
export default defineConfig({
  plugins: [react()],
  ssgOptions: {
    // Which routes to prerender. Add any route from your <Routes> here.
    // Blog post detail pages would need dynamic slug expansion — see notes below.
    includedRoutes(paths) {
      return [
        '/',
        '/blog',
        '/growth-marketing',
        '/dashboard-studio',
      ]
    },
    // Generate clean URLs: /blog instead of /blog.html
    dirStyle: 'nested',
    format: 'esm',
  },
})
