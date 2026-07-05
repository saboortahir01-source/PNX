import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "web_search",
  title: "Search the web",
  description:
    "Run a live web search and return the top organic results (title, URL, snippet). Use for competitor research, SERP checks, and keyword discovery.",
  inputSchema: {
    query: z.string().min(1).max(200).describe("Search query"),
    limit: z.number().int().min(1).max(10).default(8).describe("Number of results to return (1-10)"),
  },
  annotations: { readOnlyHint: true, idempotentHint: false, openWorldHint: true },
  handler: async ({ query, limit }) => {
    const { webSearch } = await import("@/lib/seo-tools.server");
    try {
      const results = await webSearch(query, limit);
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