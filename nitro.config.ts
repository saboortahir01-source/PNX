export default {
  // Ensure Nitro uses the node-server preset and registers public/client assets
  // with the server at build time so the node-server runtime can serve them.
  preset: "node-server",
  // publicAssets tells Nitro to include these directories as static assets.
  // dir is relative to the project root when building.
  publicAssets: [
    // Committed static public files (favicons, manifest, images)
    { dir: "public", base: "/", maxAge: 0 },
    // Vite client build output; Nitro will copy these into .output/public
    // during the build so the node-server runtime serves them.
    { dir: "dist/client", base: "/assets", maxAge: 31536000 },
    // Fallback: some builds emit into dist directly
    { dir: "dist", base: "/", maxAge: 0 },
  ],
} as any;
