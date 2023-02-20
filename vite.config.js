import { sveltekit } from "@sveltejs/kit/vite";
import basicSsl from '@vitejs/plugin-basic-ssl'

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

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "src/variables.scss" as *;',
      },
    },
  },
};

export default config;
