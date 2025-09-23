// @ts-check
import { defineConfig } from 'astro/config'
import vercel from '@astrojs/vercel/serverless'   // <-- add this
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  output: 'server',                 // <-- required for API routes
  adapter: vercel(),                // <-- deploy as serverless functions on Vercel
  vite: { plugins: [tailwindcss()] }
})
