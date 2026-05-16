import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
  type UIMessage,
} from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";
import { fetchPage, webSearch } from "@/lib/seo-tools.server";

const SYSTEM_PROMPT = `You are a senior SEO expert and strategist. You help users:
- Audit on-page SEO of any URL (titles, meta, headings, schema, images, links)
- Generate optimized titles, meta descriptions, blog outlines, FAQ schema, alt text
- Brainstorm and cluster keywords by search intent (informational, commercial, transactional, navigational)
- Analyze SERPs and competitor pages, surfacing patterns and angles to win
- Advise on technical SEO, internal linking, schema, Core Web Vitals, and content strategy

You have tools:
- fetch_page: fetch a URL and return its on-page SEO data. Always use this when the user pastes a URL or asks for an audit.
- web_search: get top web results for a query. Use for competitor/SERP analysis or keyword research grounded in real results.
- analyze_serp: get top results AND fetch their pages. Use sparingly for deep SERP analysis (max 5 urls).

Rules:
- When a user gives a URL, call fetch_page before giving advice.
- After tool calls, write a clear, prioritized response with concrete recommendations.
- Use markdown headings, bullet lists, and short tables when helpful.
- Be specific and actionable — no generic SEO platitudes.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const body = (await request.json().catch(() => ({}))) as {
          messages?: UIMessage[];
        };
        const messages = Array.isArray(body.messages) ? body.messages : [];

        const key = process.env.LOVABLE_API_KEY;
        if (!key) {
          return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        }

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3-flash-preview");

        const tools = {
          fetch_page: tool({
            description:
              "Fetch a URL and extract on-page SEO data (title, meta, headings, OG, JSON-LD, links, images, word count).",
            inputSchema: z.object({
              url: z.string().min(3).max(2048).describe("Full URL of the page to analyze"),
            }),
            execute: async ({ url }) => {
              try {
                return await fetchPage(url);
              } catch (err) {
                return {
                  error: `Failed to fetch ${url}: ${(err as Error).message}`,
                };
              }
            },
          }),
          web_search: tool({
            description:
              "Search the web for a query and return top results (title, URL, snippet). Use for competitor and SERP research.",
            inputSchema: z.object({
              query: z.string().min(1).max(200),
              limit: z.number().int().min(1).max(10).default(8),
            }),
            execute: async ({ query, limit }) => {
              try {
                const results = await webSearch(query, limit);
                return { query, results };
              } catch (err) {
                return { error: (err as Error).message };
              }
            },
          }),
          analyze_serp: tool({
            description:
              "Search the web for a query, then fetch the top N results (max 5) and return their on-page SEO data. Use for deep SERP analysis.",
            inputSchema: z.object({
              query: z.string().min(1).max(200),
              topN: z.number().int().min(1).max(5).default(3),
            }),
            execute: async ({ query, topN }) => {
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
                  })
                );
                return { query, pages };
              } catch (err) {
                return { error: (err as Error).message };
              }
            },
          }),
        };

        const result = streamText({
          model,
          system: SYSTEM_PROMPT,
          tools,
          stopWhen: stepCountIs(50),
          messages: await convertToModelMessages(messages),
        });

        return result.toUIMessageStreamResponse({ originalMessages: messages });
      },
    },
  },
});