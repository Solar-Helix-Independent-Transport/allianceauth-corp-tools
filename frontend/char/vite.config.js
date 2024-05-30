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
          // creating a chunk to react routes deps. Reducing the vendor chunk size
          if (id.includes("react-router-dom") || id.includes("react-router")) {
            return "@react-router";
          }

          if (
            id.includes("react-query") ||
            id.includes("react-select") ||
            id.includes("javascript-time-ago") ||
            id.includes("bootstrap") ||
            id.includes("react-select")
          ) {
            return "@libs";
          }
          if (id.includes("react-query") || id.includes("react-table")) {
            return "@tanstack";
          }

          if (id.includes("amcharts")) {
            return "@charts";
          }

          if (id.includes("components/char")) {
            return "@char-components";
          }

          if (id.includes("components/admin")) {
            return "@admin-components";
          }

          if (id.includes("components/graphs")) {
            return "@graph-components";
          }

          if (id.includes("components/skills")) {
            return "@skill-components";
          }

          if (id.includes("components/")) {
            return "@components";
          }
        },
      },
    },
  },
});
