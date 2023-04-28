import { sveltekit } from "@sveltejs/kit/vite";
import basicSsl from '@vitejs/plugin-basic-ssl'
import { fileURLToPath, URL } from 'node:url'

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit(), basicSsl()],

  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: [".."],
    },
    https: true,
  },

  resolve: {
    // alias: {
    //   '@': fileURLToPath(new URL('./src', import.meta.url))
    // }
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "src/variables.scss" as *;',
      },
    },
  },
};

export default config;
