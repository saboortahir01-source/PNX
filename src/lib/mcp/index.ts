import { defineMcp } from "@lovable.dev/mcp-js";
import auditPageTool from "./tools/audit-page";
import webSearchTool from "./tools/web-search";
import imageSearchTool from "./tools/image-search";
import analyzeSerpTool from "./tools/analyze-serp";

export default defineMcp({
  name: "pnx-seo-mcp",
  title: "PNX — SEO Agent",
  version: "0.1.0",
  instructions:
    "PNX is a free agentic SEO assistant. Use `audit_page` to pull live on-page SEO signals for any URL. Use `web_search` for competitor and SERP research. Use `analyze_serp` to compare the top ranking pages for a query. Use `image_search` for visual references to real people, brands, or products.",
  tools: [auditPageTool, webSearchTool, analyzeSerpTool, imageSearchTool],
});