import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "image_search",
  title: "Search the web for images",
  description:
    "Find images for a query — useful for people, brands, products, or visual references. Returns image URLs, source pages, and thumbnails.",
  inputSchema: {
    query: z.string().min(1).max(200).describe("Image search query"),
    limit: z.number().int().min(1).max(8).default(4).describe("Number of images (1-8)"),
  },
  annotations: { readOnlyHint: true, idempotentHint: false, openWorldHint: true },
  handler: async ({ query, limit }) => {
    const { imageSearch } = await import("@/lib/seo-tools.server");
    try {
      const results = await imageSearch(query, limit);
      return {
        content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
        structuredContent: { query, results },
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: (err as Error).message }],
        isError: true,
      };
    }
  },
});