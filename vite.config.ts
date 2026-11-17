import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Relative asset paths work both on GitHub Pages project sites and locally.
  base: "./",
  plugins: [react()],
  server: { host: "0.0.0.0" },
});
