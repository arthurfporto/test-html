// vitest.config.js
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Como estamos importando o JSDOM manualmente dentro do teste
    // para ler um arquivo externo, o ambiente 'node' é mais estável.
    environment: "node",
    include: ["tests/**/*.test.js"],
  },
});
