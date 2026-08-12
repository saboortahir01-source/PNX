import { defineConfig } from "@Lovable.dev/vite-tanstack-config";
import { nitro } from "nitro/vite";

export default defineConfig({
  plugins: [
    nitro({
      preset: "node-server",
    }),
  ],
  tanstackStart: {
    server: { entry: "src/server.ts" },
  },
});
