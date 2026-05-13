import React from 'react'
import { ViteReactSSG } from 'vite-react-ssg'
import Portfolio from './App.jsx'

// ViteReactSSG handles:
//   - createRoot + hydrateRoot in the browser
//   - renderToString during build
// Your App.jsx still renders <Routes> internally — that keeps working.
// We just hand SSG a single catch-all so it knows there's one entry component.
const routes = [
  {
    path: '/*',
    element: <Portfolio />,
  },
]

export const createRoot = ViteReactSSG(
  { routes },
  ({ router, routes, isClient, initialState }) => {
    // Hook for things like analytics. Leave empty for now.
  }
)
