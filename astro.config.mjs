// @ts-check
import { defineConfig } from 'astro/config'
import vercel from '@astrojs/vercel/serverless'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  output: 'server',           // needed for API routes
  adapter: vercel(),          // runs as Vercel serverless
  vite: { plugins: [tailwindcss()] },
  site: 'https://www.holovin.com',
})
