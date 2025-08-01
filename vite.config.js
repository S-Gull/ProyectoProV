import { defineConfig } from "vite";

export default defineConfig({
  open: "/carrito.html",
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
    proxy: {
      // Proxy para tiles de OpenStreetMap
      "/osm-tiles/": {
        target: "https://a.tile.openstreetmap.org",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/osm-tiles/, ""),
      },
      // Añade un proxy específico para pravatars
      "/pravatar/": {
        target: "https://i.pravatar.cc",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/pravatar/, ""),
      },
      // Proxy para llamadas PHP backend (PHPMailer)
      "/api/": {
        target: "http://localhost:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  optimizeDeps: {
    exclude: ["@sqlite.org/sqlite-wasm"],
  },
  worker: {
    format: "es",
  },
  assetsInclude: ["**/*.wasm"],
});
