// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Change this to your real domain once it's deployed (used for social share previews).
  site: 'https://chompapproved.com',
  trailingSlash: 'ignore',
  vite: {
    plugins: [tailwindcss()],
  },
});
