import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import { serviceWorkerPlugin } from "@gautemo/vite-plugin-service-worker";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    serviceWorkerPlugin({
      filename: "sw.js",
    }),
  ],
  resolve: {
    alias: {
      vue: "vue/dist/vue.esm-bundler.js",
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
