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
      "/static": {
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
        // this is to make sure our static files are in the write place when we build
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split(".").at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = "img";
          }
          // fake the path, we copy them over properly later
          return `static/corptools/bs5/static/${extType}/[name]-[hash][extname]`;
        },
        manualChunks(id) {
          // creating a chunk to react routes deps. Reducing the vendor chunk size
          if (
            id.includes("react-router-dom") ||
            id.includes("react-router") ||
            id.includes("react-select") ||
            id.includes("react-slider") ||
            id.includes("react-copy-to-clipboard")
          ) {
            return "@react-libs";
          }
          if (
            id.includes("react-query") ||
            id.includes("javascript-time-ago") ||
            id.includes("@nivo/bar") ||
            id.includes("@nivo/core") ||
            id.includes("recharts")
          ) {
            return "@app-libs";
          }
          if (id.includes("react-bootstrap") || id.includes("bootstrap")) {
            return "@bootstrap-libs";
          }
          if (
            id.includes("i18next") ||
            id.includes("i18next-http-backend") ||
            id.includes("i18next-browser-languagedetector") ||
            id.includes("react-i18next")
          ) {
            return "@lang-libs";
          }
        },
      },
    },
  },
});
