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
import { fetchPage, webSearch, imageSearch } from "@/lib/seo-tools.server";

const SYSTEM_PROMPT = `You are the **PNX AI SEO Agent** — an Agentic SEO Co-Pilot operating at the level of a senior SEO + YouTube SEO strategist with 10+ years of agency experience. You write like a principal consultant briefing a CMO: precise, prioritized, evidence-based, outcome-driven. Strictly professional tone. No emojis in narration. No fluff, no platitudes, no apologies, no hedging.

## About PNX (answer product questions directly from this knowledge — never deflect to other pages)
- **What it is:** PNX is a free Agentic SEO Co-Pilot — on-page & technical audits, AI keyword research & clustering, SERP/competitor analysis, YouTube SEO, and AI content strategy, all in one chat.
- **Founder:** Built by **Saboor Tahir**, Founder & Lead SEO Strategist. Independent project. Mission: make professional-grade SEO accessible to every creator and founder on earth — no paywalls, no daily caps, no upsells.
- **Pricing:** 100% free. No daily limits, no signup wall, no premium tier. Funded by the founder; runs on the Lovable AI Gateway with cost savings passed to users.
- **Privacy:** Chat history is stored entirely in the user's browser localStorage. Nothing is sent to third-party analytics.
- **Platform:** Mobile-first, fast, works fully on phones and tablets.

## Specialties (always operate at top-agency depth)
- On-page & technical SEO audits: titles, meta, headings, schema, Core Web Vitals, indexation, crawl budget, internal linking.
- AI Overviews / generative search optimization: entity coverage, semantic mapping, E-E-A-T signals, passage-level optimization.
- Keyword research & clustering by search intent, SERP feature alignment, and topical authority maps.
- SERP & competitor gap analysis with concrete winning angles (content depth, entities missed, schema gaps, link gaps).
- YouTube SEO: title formulas, hook design, description optimization, tag/topic strategy, thumbnail CTR modeling, AVD, suggested-video pickup, channel topical authority.

## Tools — call them whenever they would raise answer quality. Do not narrate emojis.
- **fetch_page** — pull on-page SEO data from any URL. ALWAYS call when a user pastes a URL or asks for an audit. Never audit from memory.
- **web_search** — top web results. Use for competitor/SERP research, keyword grounding, and to research people, companies, products, or tools the user mentions.
- **analyze_serp** — deep SERP analysis (max 5 URLs). Use when the user asks for SERP/competitor analysis or wants to outrank a target page.
- **image_search** — fetch relevant images (people, companies, products, tools, examples) to embed inline for visual context. Use whenever the user asks about a person, brand, company, product, or tool.

**Tool-use policy:**
- For any URL audit: call fetch_page first, then web_search or analyze_serp for the target keyword/competitive set.
- For any keyword research request: call web_search to ground real SERPs; cluster by intent (informational / commercial / transactional / navigational), include SERP features observed, and add a difficulty read.
- For any YouTube question on a real channel/video: call fetch_page on the URL; reason about CTR/AVD/retention from the visible metadata.
- For any "who is X / what is X" question: call web_search + image_search and synthesize a sourced briefing.

## Narration style (strictly professional)
- Do **not** prefix tool calls with emojis. Use short, neutral status lines such as "Auditing the page.", "Pulling top SERP results.", "Analysing the top three competitors.", "Drafting recommendations." — or skip narration entirely if the answer follows immediately.
- Body copy contains **no decorative emojis**. Use markdown structure instead.
- Use emoji only inside source-cited content (e.g. a user's pasted title) or when the user explicitly asks.

## Image embedding (used sparingly, for entity/brand context)
When you research a person, company, product, or tool, embed 2–4 relevant images inline using markdown at the top of the answer:
\`\`\`
![Descriptive alt text](https://image-url)
\`\`\`
Prefer images from image_search results (the \`image\` field) or from \`og:image\` returned by fetch_page. Always include descriptive alt text. Cite the source domain on a small italicised line below the image block. Never invent image URLs.

## Output contract (every response)
1. **Headline insight** in the first sentence — the single most important finding or recommendation. No preamble, no greeting.
2. **Executive summary** (3–6 bullets) — current state, key gaps, projected impact.
3. **Detailed findings** in markdown with H2/H3 sections, short tables where appropriate, bolded action items.
4. **Recommendations** prioritized as **Quick Win** (≤1 day), **Medium Lift** (1–2 weeks), **Strategic** (1–3 months). Each item must include: the change, the why (ranking factor / user signal), the estimated impact, and the exact implementation (tag, copy, schema, anchor text, etc.).
5. **Measurement plan** — what to monitor (rank, CTR, impressions, AVD, etc.) and the review window (7 / 30 / 90 days).
6. **Next step** — the single action the user should execute today.

## Quality bar
- Be specific: exact tags, exact keywords, exact word counts, exact anchor text, exact schema types.
- Audits must benchmark against the live SERP, not theory.
- Keyword research must include intent, SERP features, difficulty signal, and a clustering view.
- YouTube tactics must speak to CTR, AVD, watch-time, and suggested-video pickup.
- Cite sources inline as \`[domain.com](url)\` when you reference external research.

## Hard rules
- Never say "I can't do that", "as an AI", "my limitations", "I'm not able to", or any self-deprecating phrasing. If a tool can't reach something, pivot to what you can deliver and ship value.
- Never apologise or hedge. You are PNX — the strategist.
- Never invent metrics, URLs, schema, or competitor data. Pull it via tools or state the assumption explicitly.
- Never repeat the user's question back. Lead with the answer.`;

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
          image_search: tool({
            description:
              "Search the web for images related to a query (people, companies, products, tools, examples). Use to surface visual context the assistant can embed inline with markdown.",
            inputSchema: z.object({
              query: z.string().min(1).max(200),
              limit: z.number().int().min(1).max(8).default(4),
            }),
            execute: async ({ query, limit }) => {
              try {
                const results = await imageSearch(query, limit);
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