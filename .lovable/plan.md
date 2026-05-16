# SEO AI Agent — Plan

A threaded chat agent that acts as an SEO expert. Uses Lovable AI Gateway (auto-provisioned, no API key needed from you) plus tools for live web fetching and search.

## What it does

- **On-page SEO audit** — paste a URL; agent fetches it server-side and reports title, meta description, headings, image alts, canonical, OG tags, word count, and prioritized fixes.
- **SEO content generation** — titles, meta descriptions, blog outlines, FAQ schema, alt text.
- **Keyword ideas & clustering** — brainstorm, group by intent (informational / commercial / transactional / navigational).
- **Competitor / SERP analysis** — search the web for a query, summarize top-ranking pages, extract patterns, suggest angles to win.
- **General SEO expert chat** — strategy, technical SEO, schema, internal linking, etc.

## Interface

- Threaded chat (sidebar with thread list + active thread page at `/chat/$threadId`).
- Empty state with suggested prompts ("Audit https://...", "Keyword ideas for...", "Competitors for...").
- Streamed responses, tool-call accordions (collapsed by default) showing which tool ran with which inputs.
- Custom rendering for audit results (score, checklist), keyword clusters (grouped cards), SERP results (ranked list w/ titles + URLs).

## History

- Stored in **browser localStorage only** — no login required, no database.
- Per-thread messages, thread list, new-thread & delete actions.
- Bootstrapped idempotently (no StrictMode duplicate threads).

## Tools the agent will have

1. `fetch_page(url)` — server-side fetch + parse HTML; returns title, meta, headings, links, images, OG, JSON-LD, word count. Used for audits.
2. `web_search(query)` — server-side search (DuckDuckGo HTML endpoint, no API key) returning top results with titles/URLs/snippets.
3. `analyze_serp(query)` — combines `web_search` + `fetch_page` on top N results to extract patterns.
4. `generate_keyword_clusters(seed)` — pure-LLM tool (structured output) producing grouped keywords with intent labels.

All tools live in a TanStack server route (`/api/chat`) using AI SDK `streamText` + `tool()` with Zod schemas and `stopWhen: stepCountIs(50)`.

## Tech / files

```text
src/routes/
  index.tsx                  → redirects to a thread (creates one if none)
  chat.$threadId.tsx         → main chat page (sidebar + conversation)
  api/chat.ts                → streamText route w/ tools
src/lib/
  ai-gateway.ts              → Lovable AI Gateway provider helper
  seo-tools.server.ts        → fetch_page, web_search, serp analysis
  threads.ts                 → localStorage thread store
src/components/
  ChatWindow.tsx             → AI Elements based composer + transcript
  ThreadSidebar.tsx
  tool-renderers/            → AuditResult, KeywordClusters, SerpResults
```

Stack: TanStack Start + AI SDK (`ai`, `@ai-sdk/react`, `@ai-sdk/openai-compatible`) + AI Elements (`conversation`, `message`, `prompt-input`, `tool`, `shimmer`) + Zod + `cheerio` for HTML parsing.

Model: `google/gemini-3-flash-preview` (default, fast and free-tier friendly).

## What you do NOT need

- No API key — `LOVABLE_API_KEY` is auto-provisioned server-side.
- No database, no auth, no external services.
- No paid SEO APIs (Semrush/Ahrefs/etc.) — we use live HTML fetch + free search.

## Confirm and I'll build it

Reply "go" and I'll implement. If you want to add Semrush-grade data (keyword volume, difficulty, backlinks) later, that's a one-tool addition.
