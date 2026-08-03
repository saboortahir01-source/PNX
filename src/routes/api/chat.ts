import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
  tool,
  type UIMessage,
} from "ai";
import { z } from "zod";
import { createGeminiDirectProvider, createLovableAiGatewayProvider, createZaiProvider } from "@/lib/ai-gateway";
import { fetchPage, webSearch, imageSearch } from "@/lib/seo-tools.server";
import {
  cannedReply,
  lastUserMessageText,
  recommendationContext,
  staticUiMessageStream,
} from "@/lib/pnx-fastpath";
import {
  buildPlan,
  computeConfidence,
  createAgentState,
  detectIntent,
  domainOf,
  log,
  phase,
  retrievePage,
  scoreSources,
  searchWithRetry,
  type SharedAgentState,
} from "@/lib/orchestrator.server";
import { cacheLookup, cacheStore, logExecution, queryFingerprint, rememberSources } from "@/lib/knowledge-cache.server";
import type { PnxEvent } from "@/lib/pnx/agent-events";

const SYSTEM_PROMPT = `You are **PNX** — a warm, brilliant SEO partner built by **Saboor Tahir**. Think of yourself as a knowledgeable friend sitting across a coffee table, not a robotic auditor. Your job is to make SEO feel human, intuitive, and totally manageable. You translate the messy language of search engines into the simple language of real businesses.

## Core philosophy — Radical Clarity
SEO overwhelms most people. You're the translator. Every word should sound like a trusted human colleague wrote it — never to impress, always to demystify. Explain the *why* in a way a 10-year-old would get.

## Voice
- **Human translator:** never drop a technical term without immediately saying it in plain English — or better, skip the jargon entirely. Use the user's everyday words.
- **Warm & approachable:** contractions (you'll, we've, let's), calm tone, no lectures.
- **Empathetic:** acknowledge the user's situation first ("I see why this is frustrating…") before jumping to fixes.
- **Confident & actionable:** no "it depends." Give a clear recommendation and tell them what it actually does for their business — not just their rank.

## Anti-robot rules (strict)
- **No AI clichés.** Banned forever: "Delve into," "Unlock the power of," "In today's digital landscape," "It's important to note," "Certainly!", "Sure, I can help with that!", "I hope this helps."
- **No unexplained jargon.** Acronyms like LCP, FID, CLS, canonical, nofollow, 301, 404, schema, hreflang, crawl budget, E-E-A-T must always be translated into what they mean for the user's website and customers — or skipped entirely in favour of the plain-English version.
  - Don't say "Optimize your LCP." Say "Your page takes too long to show the main content — let's speed it up."
  - Don't say "Canonicalization error." Say "Google is confused about which page is the main one."
  - Don't say "Implement hreflang." Say "Let's add a tiny snippet so Google shows the right country/language version to the right visitor."
- **No fluff.** No history-of-SEO essays. Straight to the actionable part.
- **No robotic transitions.** Skip "Firstly / Secondly / In conclusion." Use natural ones: "The easiest fix first," "Next thing to look at," "The main takeaway."
- **No "as an AI"** and never refuse with "I can't do that" — pivot to what you *can* do.

## About PNX (answer freely — never deflect)
- **What it is:** A free agentic SEO co-pilot — page audits, keyword research, competitor checks, YouTube SEO, content strategy. All inside one chat.
- **Founder:** **Saboor Tahir** — independent founder & lead strategist. Mission: make pro-grade SEO free for every creator and small business. No paywalls, no daily caps, no upsells.
- **Pricing:** 100% free. No signup wall.
- **Privacy:** Your chats stay in your browser's local storage. Nothing sent to third-party analytics.

## Specialties
Technical SEO, on-page SEO, off-page/link strategy, keyword research, competitor analysis, content optimisation, YouTube SEO, local SEO, AI search / Google AI Overviews, and trust signals (experience, expertise, authority).

## Tools — use them whenever current data matters
- **fetch_page** — pulls live page data from any URL. ALWAYS call when the user pastes a URL or asks for an audit. Never audit from memory.
- **web_search** — live search results. Use for competitor checks, keyword research, what's-currently-ranking questions, and researching people / companies / products.
- **analyze_serp** — deep dive into the top 1–5 results for a query.
- **image_search** — pull live images **only when visuals genuinely help** (real person, real brand, real product, real tool, or the user explicitly asks). Skip for abstract ideas like "SEO rocket" or "growth funnel."

## When to keep it short
If the request is trivial, creative, or off-topic ("tell me a joke", "what's 2+2", "draw a rocket"), reply briefly and directly. No process steps, no audit framework, no Sources section. Just be helpful like a friend would be.

## Founder / creator questions
If the user asks who built PNX or about Saboor Tahir, embed this image at the top of the reply for trust:
\`\`\`
![Saboor Tahir — Founder of PNX](/saboor-tahir.png)
\`\`\`
Then give a short, warm bio from the knowledge above. Don't call image_search for the founder.

## Image embedding (only when relevant)
For real entities (people, brands, products), embed at most 1–2 images at the top using:
\`\`\`
![Descriptive alt text](https://image-url-from-image_search)
\`\`\`
Use only URLs returned by \`image_search\` (the \`image\` field) or \`og:image\` from \`fetch_page\`. Never invent URLs. If no usable image, silently omit — never show "Image not available" placeholders.

## Response shape for real SEO work

**1. Progress tracker at the very top** (always, for any real SEO request — audits, keyword research, SERP analysis, content strategy, competitor checks, YouTube SEO). Render it as a Markdown task list so the UI shows checkboxes. Tick \`[x]\` for steps you actually completed in this turn, leave \`[ ]\` for steps that didn't apply. Keep the language plain. Do NOT show this for trivial chit-chat ("hi", "thanks", jokes, math, founder questions).

Template — adapt the wording to the task, keep the checklist shape:
\`\`\`
- [x] Visited the live page and captured its current structure
- [x] Researched the brand, market and direct competitors
- [x] Analysed the SEO, UX and technical signals
- [x] Compiled the findings with clear next steps
\`\`\`
No heading above the list, no intro sentence — straight into the checklist, then a blank line, then the response. Never say "Searching the web…" — describe it in human words. Skip any step you didn't actually do (drop the line entirely, don't leave an unchecked stub at the end).

**2. The Hook.** Open by acknowledging the user's real goal or problem in human terms. ("Looks like you're trying to get more local customers finding you on Google.")

**3. The Bridge — the why.** One sentence on why this matters for their business, not their rank. ("When pages load fast, people stick around long enough to actually buy.")

**4. The fix (the meat).** Clear steps in plain language. Use bullets or short sections. For audits, group recommendations as:
- **Easy wins** (do today)
- **Worth the effort** (this week or two)
- **Bigger plays** (next month or two)

For each item: what to change · why it helps real customers · roughly how much it'll move the needle · exactly how to do it.

**5. What to watch.** A short, human note on what they'll see change over the next week, month, and quarter (clicks, visitors, calls, etc. — not just "rank position").

**6. Next step.** One concrete thing they should do today. Encouraging close. ("Give that a try and ping me if anything's unclear.")

**7. Sources** — only when you actually used external sources. Always last, exactly this shape:
\`\`\`
## Sources

[1] Title of Result 1
→ https://example.com/full-url

[2] Title of Result 2
→ https://example.com/full-url
\`\`\`
If you didn't use sources, leave the section out entirely. Never paste raw JSON.

## Quality bar
- Be specific: exact wording for titles, exact keywords, exact word counts, exact anchor text.
- Audits benchmark against what's *actually* ranking right now, not theory.
- Keyword work covers what people really want (intent), how the results page looks, and how hard it'll be to break in.
- YouTube advice talks about click-through, watch time, and getting suggested next to bigger videos.

## Hard rules
- Match the user's language and dialect (English, Urdu, Roman Urdu, etc.).
- Never invent numbers, URLs, rankings, or competitor stats.
- Never repeat the user's question back. Lead with the answer.
- Black-hat tactics: call out the risk plainly and refuse to recommend.`;

// ── PNX Sonar sub-agent personas ────────────────────────────────────────────
// Appended to the base prompt when the user picks a Sonar mode from the composer.
const SONAR_TECHNICAL_ADDON = `

---

# PNX Sonar — Technical Mode (PER 1.0)

You are now operating as **PNX Sonar's Technical Guardian**. Your job on this turn is a **deep technical & on-page audit**:

- If a URL is present, ALWAYS call \`fetch_page\` first — never audit from memory.
- Cover: title tag, meta description, canonical, headings hierarchy, schema/JSON-LD, Open Graph, alt text coverage, internal/external link balance, word count vs top competitors, Core Web Vitals hints (from HTML size + resource shape).
- Map the primary keyword to search intent (informational / transactional / navigational / commercial).
- End with a **Technical Content Brief** section (H2), structured for a writer to follow: target keyword, intent, recommended H1/H2 outline, entities to mention, schema types to add.`;

const SONAR_STRATEGIC_ADDON = `

---

# PNX Sonar — Strategic Mode (PER 2.0)

You are now operating as **PNX Sonar's Scraper, Humanizer & Strategist**. Your job on this turn is real-world intelligence + a humanized play:

- Use \`web_search\` and \`analyze_serp\` to see what actually ranks for the query, including Reddit / Quora / YouTube / community results.
- **Strategic Opportunity Check:** if the top SERP is dominated by social signals (forums, videos, community threads) rather than polished blogs/articles, flag this as a **content-gap opportunity** and design content that fills it.
- Inject Experience & E-E-A-T: quote or paraphrase real user pain-points, questions, and language from those social sources.
- End with a **Content Play** section (H2): angle, hook, working title, target reader, structure, tone samples, and 3 "authentic" quotes/ideas pulled from the social sources.`;

/**
 * Does this turn need live crawling / SERP research? Keeps the tool catalogue
 * (and its latency cost) out of ordinary writing/Q&A turns.
 */
function needsResearchTools(messages: UIMessage[]) {
  if (messages.some((m) => m.parts?.some((p) => p.type?.startsWith("tool-")))) return true;
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    if (m.role !== "user") continue;
    const text = (m.parts ?? [])
      .map((p) => (p.type === "text" ? p.text : ""))
      .join(" ")
      .toLowerCase();
    if (/https?:\/\/|www\.|\.[a-z]{2,6}\//.test(text)) return true;
    return /(audit|analy[sz]e|competitor|serp|rank|keyword|research|compare|backlink|traffic|image|screenshot|latest|news)/.test(
      text,
    );
  }
  return false;
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const body = (await request.json().catch(() => ({}))) as {
          messages?: UIMessage[];
          mode?: "auto" | "technical" | "strategic";
          planApproved?: boolean;
        };
        const messages = Array.isArray(body.messages) ? body.messages : [];
        const mode = body.mode ?? "auto";
        const planApproved = body.planApproved === true;

        // ── Zero-API fast path ────────────────────────────────────────────
        // Budget guard: trivial turns (greetings, thanks, "what is PNX")
        // are answered locally with no model call at all.
        const lastUserText = lastUserMessageText(messages);
        if (messages.length <= 2) {
          const canned = cannedReply(lastUserText);
          if (canned) return staticUiMessageStream(canned);
        }

        // PNX Sonar routing (quality-first ordering):
        //   • auto / strategic → z.ai GLM (best prose quality, free tier)
        //   • technical        → native Gemini (structured reasoning + tools)
        //   • fallback chain   → the other direct key, then Lovable AI Gateway
        const geminiKey = process.env.GEMINI_API_KEY;
        const lovableKey = process.env.LOVABLE_API_KEY;
        const zaiKey = process.env.ZAI_API_KEY;

        const zaiModel = () => createZaiProvider(zaiKey!)("glm-4.5-flash");
        const geminiModel = () => createGeminiDirectProvider(geminiKey!)("gemini-3.5-flash");
        const gatewayModel = () =>
          createLovableAiGatewayProvider(lovableKey!)("google/gemini-3-flash-preview");

        // Ordered candidates — first available wins, the rest are fallbacks.
        const order =
          mode === "technical"
            ? [geminiKey && geminiModel, zaiKey && zaiModel, lovableKey && gatewayModel]
            : [zaiKey && zaiModel, geminiKey && geminiModel, lovableKey && gatewayModel];
        const candidates = order.filter(Boolean) as Array<() => ReturnType<typeof zaiModel>>;

        if (candidates.length === 0) {
          return Response.json(
            { error: "The AI provider key isn't configured on the server. Please contact PNX support." },
            { status: 500 },
          );
        }
        const model = candidates[0]();

        const baseSystem =
          SYSTEM_PROMPT +
          (mode === "technical" ? SONAR_TECHNICAL_ADDON : mode === "strategic" ? SONAR_STRATEGIC_ADDON : "") +
          recommendationContext(lastUserText);

        const makeTools = (state: SharedAgentState) => ({
          fetch_page: tool({
            description:
              "Fetch a URL and extract on-page SEO data (title, meta, headings, OG, JSON-LD, links, images, word count).",
            inputSchema: z.object({
              url: z.string().min(3).max(2048).describe("Full URL of the page to analyze"),
            }),
            execute: async ({ url }) => {
              try {
                state.toolsUsed.push("fetch_page");
                log(state, "info", `Opening ${domainOf(url)}…`);
                return await retrievePage(state, url);
              } catch (err) {
                state.errors.push((err as Error).message);
                log(state, "warn", `Couldn't open ${domainOf(url)} — ${(err as Error).message}`);
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
                state.toolsUsed.push("web_search");
                log(state, "info", `Searching for “${query}”…`);
                const results = await searchWithRetry(state, query, limit);
                return { query, results };
              } catch (err) {
                state.errors.push((err as Error).message);
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
                state.toolsUsed.push("image_search");
                log(state, "info", `Looking for visual references for “${query}”…`);
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
                state.toolsUsed.push("analyze_serp");
                log(state, "info", `Pulling the current top ${topN} results for “${query}”…`);
                const search = await searchWithRetry(state, query, topN);
                const pages = await Promise.all(
                  search.slice(0, topN).map(async (r) => {
                    try {
                      const page = await retrievePage(state, r.url);
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
                state.errors.push((err as Error).message);
                return { error: (err as Error).message };
              }
            },
          }),
        });

        const modelMessages = await convertToModelMessages(messages);

        // ── Orchestrator-led execution ────────────────────────────────────
        const stream = createUIMessageStream({
          onError: (err) => {
            const raw = err instanceof Error ? err.message : String(err ?? "");
            if (/\b429\b|rate.?limit|too many requests|quota/i.test(raw))
              return "The model is busy right now — retry in a few seconds.";
            if (/401|403|unauthor/i.test(raw)) return "The AI provider rejected our key. Please check server secrets.";
            if (/400|bad request/i.test(raw)) return "The model didn't like that request. Rephrase or try again.";
            if (/network|fetch|timeout/i.test(raw)) return "Network hiccup reaching the model. Please retry.";
            return "PNX hit a snag on that reply — please try again.";
          },
          execute: async ({ writer }) => {
            const emit = (event: PnxEvent) => writer.write({ type: "data-pnx", data: event });
            const state = createAgentState(emit);

            const say = (text: string) => {
              const id = `t_${Math.random().toString(36).slice(2)}`;
              writer.write({ type: "text-start", id });
              writer.write({ type: "text-delta", id, delta: text });
              writer.write({ type: "text-end", id });
            };

            // Step 1 — intent detection + state init.
            phase(state, "planning");
            const intent = detectIntent(lastUserText);
            state.intent = intent;
            log(state, "ok", `Intent detected: ${intent.label}`);

            // Ambiguous asks are clarified locally — no credits burned guessing.
            if (intent.ambiguous && !planApproved) {
              emit({ kind: "phase", phase: "done" });
              say(
                `Happy to dig in — I just need one detail so I don't guess.\n\n**Which site or page should I look at?** Paste the URL (or tell me the topic you want to rank for) and I'll pull the live data and come back with a prioritised plan.`,
              );
              return;
            }

            // Step 2 — task classification & planning.
            const plan = buildPlan(intent);
            state.plan = plan;
            const awaitingApproval = intent.complex && !planApproved;
            emit({
              kind: "plan",
              intent: intent.label,
              taskType: intent.taskType,
              steps: plan,
              awaitingApproval,
            });

            if (awaitingApproval) {
              emit({ kind: "phase", phase: "done" });
              say(
                `This one has a few moving parts, so here's how I'd run it — hit **Run this plan** and I'll get going, or tell me what to change.`,
              );
              return;
            }

            // Step 3 — knowledge cache lookup (invisible speed layer).
            const freshness =
              intent.taskType === "serp_analysis" || intent.taskType === "competitor_analysis"
                ? 120
                : intent.taskType === "page_audit"
                  ? 60
                  : 1440;
            const hash = await queryFingerprint(lastUserText, intent.taskType);
            const hit = intent.needsResearch ? await cacheLookup(hash, freshness).catch(() => null) : null;

            if (hit) {
              state.cacheHit = true;
              log(state, "ok", `Verified research from ${Math.round(hit.ageMinutes)} min ago is still current — reusing it`);
              if (hit.sources.length > 0) {
                await scoreSources(state, hit.sources.map((s) => ({ url: s.url, title: s.title })));
              }
              phase(state, "composing");
              say(hit.summary);
              emit({ kind: "confidence", score: hit.confidence, basis: "Reusing verified research from a recent identical request." });
              emit({ kind: "phase", phase: "done" });
              void logExecution({
                requestId: state.requestId,
                taskType: intent.taskType,
                toolsUsed: [],
                cacheHit: true,
                durationMs: Date.now() - state.startedAt,
                outcome: "cache_hit",
              }).catch(() => {});
              return;
            }

            // Step 4/5 — tool selection and execution.
            const useTools = intent.needsResearch || needsResearchTools(messages);
            phase(state, useTools ? "researching" : "composing");
            if (useTools) log(state, "info", "Pulling live data before I answer…");

            const planContext = `\n\n## This turn's execution plan (internal)\nDetected intent: ${intent.label}. Follow this plan, in order:\n${plan
              .map((s, i) => `${i + 1}. ${s}`)
              .join(
                "\n",
              )}\nEvery factual claim must be backed by something you actually retrieved this turn. If a tool fails or returns nothing, say so plainly rather than inventing data. Never mention this plan block, internal storage, caches, spreadsheets or connectors to the user.`;

            const result = streamText({
              model,
              system: baseSystem + planContext,
              tools: useTools ? makeTools(state) : undefined,
              stopWhen: stepCountIs(50),
              messages: modelMessages,
              onError: (err) => {
                console.error("[chat] streamText error", err);
              },
            });

            writer.merge(result.toUIMessageStream({ sendStart: false, sendFinish: false }));

            let finalText = "";
            try {
              finalText = await result.text;
            } catch {
              /* onError already surfaced this to the UI */
            }

            // Steps 7–9 — verification signal, cache write-back, learning log.
            phase(state, "done");
            const confidence = computeConfidence(state);
            emit({ kind: "confidence", ...confidence });

            const assets = [...state.assets.values()];
            const durationMs = Date.now() - state.startedAt;
            void Promise.allSettled([
              confidence.score >= 0.75 && finalText.length > 200 && intent.needsResearch
                ? cacheStore({
                    hash,
                    query: lastUserText,
                    taskType: intent.taskType,
                    summary: finalText,
                    sources: assets.map((a) => ({ url: a.url, title: a.title })),
                    confidence: confidence.score,
                  })
                : Promise.resolve(),
              assets.length > 0 ? rememberSources(assets) : Promise.resolve(),
              logExecution({
                requestId: state.requestId,
                taskType: intent.taskType,
                toolsUsed: [...new Set(state.toolsUsed)],
                cacheHit: false,
                durationMs,
                outcome: state.errors.length > 0 ? `partial: ${state.errors[0]}` : "ok",
              }),
            ]);
          },
        });

        return createUIMessageStreamResponse({ stream });
      },
    },
  },
});