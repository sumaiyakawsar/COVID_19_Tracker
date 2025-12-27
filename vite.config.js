import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/COVID_19_Tracker/",
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
  }
});
