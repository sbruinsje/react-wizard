/// <reference types="vite/client" />

import { defineConfig } from "vite";
import { resolve } from "path";
import { libInjectCss } from "vite-plugin-lib-inject-css";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    libInjectCss(),
    dts({
      entryRoot: "src", // Ensure the entry point for types matches your source folder
      outDir: resolve(__dirname, "dist"),
      tsconfigPath: resolve(__dirname, "./tsconfig.app.json"),
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: "./src/main.ts",
      name: "ReactWizard",
      fileName: "main",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        globals: {
          react: "React",
          "react-dom": "React-dom",
          "react/jsx-runtime": "react/jsx-runtime",
        },
      },
    },
  },
});
