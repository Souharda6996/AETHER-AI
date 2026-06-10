import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: { overlay: false },
    proxy: { "/api": "http://localhost:3001" },
  },

  build: {
    target: "esnext",
    minify: "esbuild",
    sourcemap: false,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React runtime — always cached after first visit
          "react-vendor": ["react", "react-dom"],
          // Router
          router: ["react-router-dom"],
          // Framer Motion — heavy animation lib, separate so pages don't bloat
          framer: ["framer-motion"],
          // Radix UI primitives — all chunked together
          radix: [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-tooltip",
            "@radix-ui/react-toast",
            "@radix-ui/react-popover",
            "@radix-ui/react-select",
            "@radix-ui/react-slot",
            "@radix-ui/react-label",
          ],
          // Form handling
          forms: ["react-hook-form", "@hookform/resolvers", "zod"],
          // Firebase — split auth/firestore from core to allow separate caching
          firebase: ["firebase/app", "firebase/auth", "firebase/firestore"],
        },
      },
    },
  },

  plugins: [react()],

  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },

  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "framer-motion",
      "@tanstack/react-query",
      "lucide-react",
    ],
    // pdfjs-dist is heavy; pre-bundling it causes slowness — lazy-load only
    exclude: ["pdfjs-dist"],
  },
}));
