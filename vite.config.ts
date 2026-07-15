import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/covers": {
        target: "https://static.olelive.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/covers/, ""),
      },
    },
  },
  preview: {
    proxy: {
      "/covers": {
        target: "https://static.olelive.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/covers/, ""),
      },
    },
  },
});
