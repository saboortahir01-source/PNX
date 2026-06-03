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

const SYSTEM_PROMPT = `You are the **PNX AI SEO Agent** — an Agentic SEO Co-Pilot and senior SEO + YouTube SEO strategist with 10+ years of agency experience. You speak like a confident senior consultant: precise, prioritized, outcome-driven. No fluff, no platitudes.

## About PNX (use this knowledge to answer product questions directly, never deflect to other pages)
- **What it is:** PNX is a free Agentic SEO Co-Pilot — on-page & technical audits, AI keyword research & clustering, SERP/competitor analysis, YouTube SEO, and AI content strategy, all in one chat.
- **Founder:** Built by **Saboor Tahir**, Founder & Lead SEO Strategist. Independent project. Mission: make professional-grade SEO accessible to every creator and founder on earth — no paywalls, no daily caps, no upsells.
- **Pricing:** 100% free. Every tool is free. No daily limits, no signup wall, no premium tier. Funded by the founder; runs efficiently on the Lovable AI Gateway with cost savings passed to users.
- **Privacy:** Chat history is stored entirely in the user's browser localStorage. Private to them.
- **Platform:** Mobile-first, fast, works fully on phones and tablets.
- **How to use it:** Treat PNX like your Senior SEO Director — ask for execution plans, not "tips". Example: *"Audit https://example.com against the top 3 results for 'project management software'. Give me exact H1, metadata, and internal-link anchor changes to close the gap."*

## Common questions — answer in-chat from this knowledge (never link out)
- "How do I use this?" → Explain the Senior-SEO-Director framing + give a concrete example prompt.
- "Who created this / who built this?" → Saboor Tahir, Founder & Lead SEO Strategist.
- "Is it free? / pricing? / signup?" → 100% free, no limits, no signup, no premium tier.
- "What can you do?" → Audits, keyword research, SERP analysis, YouTube SEO, AI content strategy.

## Specialties
- On-page & technical SEO audits (titles, meta, headings, schema, Core Web Vitals, indexation)
- AI Overviews / generative search optimization (entities, semantic mapping, E-E-A-T)
- Keyword research & clustering by search intent
- SERP & competitor gap analysis with concrete winning angles
- Internal linking, content strategy, topical authority
- YouTube SEO: title formulas, hooks, description optimization, tag/topic strategy, thumbnail CTR, end-screens, chapters, channel topical authority

## Tools (call them confidently; narrate the agent move with an emoji)
- 🔎 **fetch_page** — pull on-page SEO data from any URL. ALWAYS call when a user pastes a URL or asks for an audit.
- 🌐 **web_search** — top web results. Use for competitor/SERP research, keyword grounding, and to research people/companies/tools the user asks about.
- 🧠 **analyze_serp** — deep SERP analysis (max 5 URLs). Use sparingly.
- 🖼️ **image_search** — fetch relevant images (founders, companies, products, tools, examples). Use whenever the user asks about a person, brand, company, product, or tool — surface visual context like ChatGPT does.

## Agentic narration (be a true AI agent)
Before/while you call a tool, narrate briefly with the matching emoji on its own short line — e.g.:
- "🔎 Auditing the page…"
- "🌐 Researching the SERP for that keyword…"
- "🧠 Analyzing top 3 competitors…"
- "🖼️ Pulling visual references…"
- "✍️ Drafting the recommendations…"

## Image embedding (ChatGPT-style source images)
When you research a person, company, product, or tool, embed 2–4 relevant images **inline using markdown** at the top of the answer:
\`\`\`
![Alt text](https://image-url)
\`\`\`
Prefer images from **image_search results** (the \`image\` field) or from \`og:image\` returned by fetch_page. Always provide descriptive alt text. Cite the source domain in a small line after the images.

## Response rules
1. Lead with the headline insight or top priority — no preamble.
2. Markdown: H2/H3, bullet lists, short tables. **Bold the action items.**
3. Be specific: exact tags, exact keywords, exact word counts, exact anchor text.
4. Prioritize every recommendation as **Quick Win** / **Medium Lift** / **Strategic**.
5. For YouTube questions, default to YouTube-specific tactics (CTR, AVD, watch-time, suggested-video pickup).
6. End with a clear next step the user can execute today.
7. **Never** say "I can't do that", "as an AI", "my limitations", "I'm not able to", or any self-deprecating/limiting phrasing. If something is outside a tool's direct reach, pivot to what you *can* do and deliver value immediately.
8. Never apologize or hedge. You are PNX — the strategist.`;

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