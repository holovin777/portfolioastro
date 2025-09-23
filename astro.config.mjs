// @ts-check
import { defineConfig } from 'astro/config'
import vercel from '@astrojs/vercel/serverless'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  output: 'server',       // SSR so actions can run
  adapter: vercel(),      // deploy as Vercel serverless
  vite: { plugins: [tailwindcss()] },
})
