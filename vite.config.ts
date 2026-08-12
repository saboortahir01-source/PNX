import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import netlify from "@netlify/vite-plugin-tanstack-start";

export default defineConfig({
  plugins: [netlify()],
  tanstackStart: {
    server: { entry: "src/server.ts" },
  },
  nitro: {
    preset: 'node-server',
    output: {
      dir: '.output',
    },
  },
});