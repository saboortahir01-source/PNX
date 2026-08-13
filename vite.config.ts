import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Configure Nitro via the Lovable wrapper and fix TanStack server entry.
export default defineConfig({
  nitro: {
    preset: "node-server",
  },
  tanstackStart: {
    server: { entry: "server.ts" },
  },
});
