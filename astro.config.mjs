import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import { alphaTab } from '@coderline/alphatab/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://bryanthayes.com',
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(),
  ],
  output: 'static',
  image: {
    domains: ['bryanthayes.com'],
  },
  vite: {
    plugins: [alphaTab()]
  },
});