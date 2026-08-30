import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// Vercel expone el commit que está construyendo en esta variable, sin
// depender de que el checkout tenga la carpeta .git disponible. En local
// (donde sí hay .git) usamos `git rev-parse` como respaldo.
function getCommitHash(): string {
  if (process.env.VERCEL_GIT_COMMIT_SHA) {
    return process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7);
  }
  try {
    return execSync("git rev-parse --short HEAD").toString().trim();
  } catch {
    return "sin-commit";
  }
}

export default defineConfig({
  plugins: [react()],
  server: { port: 3000 },
  resolve: {
    alias: {
      "@": path.resolve(dirname, "./src"),
    },
  },
  define: {
    __APP_COMMIT_HASH__: JSON.stringify(getCommitHash()),
  },
});
