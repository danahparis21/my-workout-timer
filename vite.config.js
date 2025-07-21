// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/my-workout-timer/", // ← this is important
  plugins: [react()],
});
