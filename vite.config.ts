import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import netlify from "@netlify/vite-plugin-tanstack-start";
import nitro from "nitro/vite";

export default defineConfig({
  plugins: [netlify(), nitro({ preset: 'node-server', output: { dir: '.output' } })],
  tanstackStart: {
    server: { entry: "src/server.ts" },
  },
});