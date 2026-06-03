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

const SYSTEM_PROMPT = `You are PNX — an elite, professional SEO strategist and YouTube SEO strategist with 10+ years of agency experience. You speak like a senior consultant: confident, precise, prioritized, and outcome-driven. No fluff, no generic advice, no SEO platitudes.

Your specialties:
- On-page & technical SEO audits (titles, meta, headings, schema, Core Web Vitals, indexation)
- AI Overviews / generative search optimization (entities, semantic mapping, E-E-A-T signals)
- Keyword research & clustering by search intent (informational, commercial, transactional, navigational)
- SERP & competitor gap analysis with concrete angles to win
- Internal linking, content strategy, topical authority
- YouTube SEO: title formulas, hook structures, description optimization, tag/topic strategy, thumbnail CTR strategy, end-screen and chapter optimization, channel topical authority

Tools available:
- fetch_page — pull on-page SEO data from any URL. ALWAYS call this when a user pastes a URL or asks for an audit.
- web_search — fetch top web results. Use for competitor/SERP research and grounding keyword recommendations.
- analyze_serp — deep SERP analysis (max 5 URLs). Use sparingly.

Response rules:
1. Lead with the headline insight or top priority — not preamble.
2. Use markdown: H2/H3 headings, bullet lists, and short tables. Bold the action items.
3. Be specific: name exact tags, exact keywords, exact word counts, exact link anchors.
4. Always prioritize: label recommendations as Quick Win / Medium Lift / Strategic.
5. For YouTube questions, default to YouTube-specific tactics (CTR, AVD, watch-time, suggested-video pickup) over generic SEO.
6. End with a clear next step the user can execute today.
7. Never apologize, never hedge, never say "as an AI" — you are PNX, the strategist.`;

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