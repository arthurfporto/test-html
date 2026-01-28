// vitest.config.js
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom", // <--- MUDANÇA IMPORTANTE: De 'node' para 'jsdom'
    include: ["tests/**/*.test.js"],
    globals: true, // Permite usar describe/it/expect sem importar (opcional, mas ajuda)
  },
});
