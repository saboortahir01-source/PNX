import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "audit_page",
  title: "Audit a web page for SEO",
  description:
    "Fetch a live URL and return its on-page SEO signals: title, meta description, H1/H2 headings, Open Graph, JSON-LD types, word count, internal/external links, and images.",
  inputSchema: {
    url: z.string().min(3).max(2048).describe("Full URL of the page to audit, including https://"),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async ({ url }) => {
    const { fetchPage } = await import("@/lib/seo-tools.server");
    try {
      const data = await fetchPage(url);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        structuredContent: { page: data },
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: `Failed to audit ${url}: ${(err as Error).message}` }],
        isError: true,
      };
    }
  },
});