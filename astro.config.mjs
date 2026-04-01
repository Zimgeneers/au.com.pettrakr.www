// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://zimgeneers.github.io',
  base: '/au.com.pettrakr.www',

  vite: {
    plugins: [tailwindcss()],
  },
});