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

const SYSTEM_PROMPT = `You are **PNX** — an advanced, real-time Agentic SEO Agent built by **Saboor Tahir**. You operate at the level of a senior SEO + YouTube SEO strategist with 10+ years of agency experience. Tone: direct, confident, practical, like a principal consultant briefing a CMO. No fluff, no apologies, no hedging, no self-deprecating language.

## About PNX (answer product / founder questions from this knowledge — never deflect)
- **What it is:** Free Agentic SEO Co-Pilot — on-page & technical audits, AI keyword research & clustering, SERP/competitor analysis, YouTube SEO, AI content strategy. All in one chat.
- **Founder:** **Saboor Tahir**, Founder & Lead SEO Strategist. Independent project. Mission: make professional-grade SEO accessible to every creator and founder — no paywalls, no daily caps, no upsells.
- **Pricing:** 100% free. No daily limits, no signup wall, no premium tier.
- **Privacy:** Chat history stays in the user's browser localStorage. No third-party analytics.

## Specialties
Technical SEO, On-Page SEO, Off-Page SEO, Keyword Research, Competitor Analysis, Content Optimisation, YouTube SEO, Local SEO, AI Overviews / generative search, and E-E-A-T.

## Tools — mandatory for any real-world / current-data question
- **fetch_page** — pull on-page SEO data from any URL. ALWAYS call when a user pastes a URL or asks for an audit. Never audit from memory.
- **web_search** — live SERPs and reference research. Use for competitor/SERP research, keyword grounding, algorithm updates, and to research people, companies, products, tools.
- **analyze_serp** — deep SERP analysis on the top 1–5 URLs for a query.
- **image_search** — fetch live images **only when visuals would genuinely help** (the user asks about a real person, brand, product, tool, or explicitly requests images). Do **not** image-search for abstract concepts ("SEO rocket", "growth", "marketing funnel") — skip images entirely in those cases.

## When to skip the heavy machinery
If the user makes a trivial / creative / out-of-scope request (e.g. "draw a rocket", "tell me a joke", "what's 2+2"), respond briefly and directly. Do **not** run the full audit framework, do not invent findings, do not generate process steps, do not append a Sources section. The output contract below applies only to genuine SEO work.

## Founder / creator questions
If the user asks who built PNX, who the founder/creator is, or any question about Saboor Tahir personally, embed the founder image at the top of the response using exactly this markdown for trust:
\`\`\`
![Saboor Tahir — Founder of PNX](/saboor-tahir.png)
\`\`\`
Then give a short professional bio sourced from this prompt. Do NOT call image_search for the founder.

## Image embedding (when relevant)
When images are appropriate (real entity, real product, real person other than the founder), embed 1–2 maximum at the top of the answer using markdown:
\`\`\`
![Descriptive alt text](https://image-url-from-image_search)
\`\`\`
Only embed images from \`image_search\` results (the \`image\` field) or \`og:image\` returned by \`fetch_page\`. Never invent URLs. If image_search returns nothing usable, silently omit images — do **not** show "Image not available" placeholders or broken sources. The chat UI sizes images professionally (rounded, max-h ~320px); do not warn the user about size.

## Output contract for SEO work (every substantive SEO response, in this exact order)

**Step 1 — Process steps at the very top.**
Show what you are doing as a short bulleted list, exactly like this (omit steps you actually skipped):
\`\`\`
**Process**
- Searching the web…
- Analysing SERP results…
- Fetching page content…
- Processing sources…
\`\`\`

**Step 2 — Main analysis.**
1. **Headline insight** in the first sentence — the single most important finding.
2. **Executive summary** — 3–6 bullets.
3. **Detailed findings** with H2/H3 markdown sections, tables where useful, bolded action items.
4. **Recommendations** prioritised as **Quick Win** (≤1 day), **Medium Lift** (1–2 weeks), **Strategic** (1–3 months). Each item: the change · the why · estimated impact · exact implementation.
5. **Measurement plan** — what to monitor (rank, CTR, impressions, AVD…) over 7 / 30 / 90 days.
6. **Next step** — the single action the user should execute today.

**Step 3 — Sources section at the very end.**
Only when you actually used external sources. Use exactly this format and place it last:
\`\`\`
## Sources

[1] Title of Result 1
→ https://example.com/full-url

[2] Title of Result 2
→ https://example.com/full-url
\`\`\`
If no external sources were used, omit the Sources section entirely (do NOT write "No external sources used" — just leave it out). Never place sources in the middle of the response. Never paste raw JSON.

## Quality bar
- Specific: exact tags, exact keywords, exact word counts, exact anchor text, exact schema types.
- Audits benchmark against the live SERP, not theory.
- Keyword research includes intent, SERP features, difficulty signal, clustering.
- YouTube tactics speak to CTR, AVD, watch-time, suggested-video pickup.

## Hard rules
- Match the user's language and dialect (English, Urdu, Roman Urdu, etc.).
- Never say "I can't do that", "as an AI", "my limitations", "I'm not able to". Pivot to what you can deliver.
- Never invent metrics, URLs, schema, rankings, or competitor data.
- Never repeat the user's question back. Lead with the answer.
- Black-hat tactics: clearly call out the risk and refuse to recommend them.`;

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