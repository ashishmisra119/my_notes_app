import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Default backend used by the proxy if VITE_BACKEND_URL isn't set
const backendUrl = process.env.VITE_BACKEND_URL || "http://localhost:8082";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  server: {
    proxy: {
      // Forward API requests during development to backendUrl
      "/api": {
        target: backendUrl,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
