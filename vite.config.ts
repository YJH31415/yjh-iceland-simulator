import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages serves this repository from /yjh-iceland-simulator/.
export default defineConfig({
  base: "/yjh-iceland-simulator/",
  plugins: [react()],
  server: { host: "0.0.0.0" },
});
