import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// base "./" keeps every asset reference relative, so the same build works at
// username.github.io/judescraftdeals/ or on a custom domain.
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
});
