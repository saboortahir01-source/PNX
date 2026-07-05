import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "analyze_serp",
  title: "Analyze SERP top results",
  description:
    "Search a query and fetch on-page SEO data for the top N results (max 5). Returns title, meta, H1, top H2s, word count, and JSON-LD types per result.",
  inputSchema: {
    query: z.string().min(1).max(200).describe("Search query to analyze"),
    topN: z.number().int().min(1).max(5).default(3).describe("How many top results to analyze (1-5)"),
  },
  annotations: { readOnlyHint: true, idempotentHint: false, openWorldHint: true },
  handler: async ({ query, topN }) => {
    const { fetchPage, webSearch } = await import("@/lib/seo-tools.server");
    try {
      const search = await webSearch(query, topN);
      const pages = await Promise.all(
        search.slice(0, topN).map(async (r) => {
          try {
            const page = await fetchPage(r.url);
            return {
              url: r.url,
              title: page.title,
              metaDescription: page.metaDescription,
              h1: page.h1,
              h2: page.h2.slice(0, 10),
              wordCount: page.wordCount,
              jsonLdTypes: page.jsonLdTypes,
            };
          } catch (err) {
            return { url: r.url, error: (err as Error).message };
          }
        }),
      );
      return {
        content: [{ type: "text", text: JSON.stringify({ query, pages }, null, 2) }],
        structuredContent: { query, pages },
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: (err as Error).message }],
        isError: true,
      };
    }
  },
});