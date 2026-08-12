import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { nitro } from "nitro/vite";

// Ensure Nitro's Vite plugin is passed into the underlying Vite config
// so that client assets are generated and copied into .output/public for
// self-hosted node-server deployments.
export default defineConfig({
  vite: {
    plugins: [
      nitro({
        preset: "node-server",
      }),
    ],
  },
  tanstackStart: {
    server: { entry: "src/server.ts" },
  },
});
