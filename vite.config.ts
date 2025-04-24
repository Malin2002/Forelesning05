import { defineConfig } from "vite";

export default defineConfig({
  base: "/Forelesning05",
  server: {
    proxy: {
      "/Forelesning05/api": "http://localhost:3000",
    },
  },
});
