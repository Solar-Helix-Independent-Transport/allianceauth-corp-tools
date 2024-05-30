import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3002,
    proxy: {
      "/audit/api/": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    sourcemap: true,
    manifest: true,
    outDir: "build/static/",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes("react-select") ||
            id.includes("javascript-time-ago") ||
            id.includes("bootstrap")
          ) {
            return "@libs";
          }
          if (id.includes("react-query") || id.includes("react-table")) {
            return "@tanstack";
          }

          if (id.includes("amcharts")) {
            return "@charts";
          }
        },
      },
    },
  },
});
