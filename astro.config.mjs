// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  // 替换为你的实际域名
  site: 'https://your-blog.pages.dev',

  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/private/'),
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  output: 'static',

  build: {
    assets: 'assets',
  },

  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },

  server: {
    host: '0.0.0.0',
    port: 4321,
  },

  adapter: cloudflare(),
});