// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: import.meta.env.CF_PAGES_URL || 'https://example.com',
  integrations: [tailwind(), sitemap()],
});