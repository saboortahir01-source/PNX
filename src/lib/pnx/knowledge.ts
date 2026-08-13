// PNX Self-Knowledge Engine V1 — repository-backed verified public knowledge
// This module is intentionally small, deterministic and local-first. It
// exposes a typed set of canonical public facts about PNX (identity,
// agents, connectors, tools, pages, blogs, product updates) and a conservative
// query function that only returns facts explicitly present here.

// NOTE: Keep this file free of any secrets, environment reads, network calls
// or runtime side-effects. It must remain a static repository-backed index.

export type KnowledgeRecord = {
  id: string;
  type:
    | "identity"
    | "agent"
    | "connector"
    | "tool"
    | "page"
    | "blog"
    | "update";
  name: string;
  aliases?: string[];
  summary?: string;
  status?: "available" | "coming_soon" | "deprecated" | "unknown";
  sourceUrl?: string;
  publishedAt?: string; // ISO date when applicable
  updatedAt?: string; // ISO date when applicable
};

// Identity — only include facts that are explicitly published in the repo.
export const IDENTITY: KnowledgeRecord = {
  id: "pnx-identity",
  type: "identity",
  name: "PNX",
  aliases: ["pnx", "pnx seo"],
  summary:
    "PNX is a 100% free agentic SEO co-pilot built to run live page audits, keyword research, SERP analysis and YouTube SEO from a single chat interface.",
  status: "available",
  sourceUrl: "https://pnx.lovable.app/about",
};

// Agents — SONAR personas and short verified facts derived from composer/UI & prompts
export const AGENTS: KnowledgeRecord[] = [
  {
    id: "sonar-01",
    type: "agent",
    name: "Sonar 01 (Technical)",
    aliases: ["sonar 01", "sonar-01", "technical sonar", "technical mode"],
    summary:
      "PNX Sonar — Technical Mode: focused on deep technical & on-page audits (title, meta, headings, schema/JSON-LD, Open Graph, alt text, word count, Core Web Vitals hints). When a URL is present, the agent ALWAYS fetches the page first.",
    status: "available",
    sourceUrl: "https://pnx.lovable.app/chat",
  },
  {
    id: "sonar-02",
    type: "agent",
    name: "Sonar 02 (Strategic)",
    aliases: ["sonar 02", "sonar-02", "strategic sonar", "strategic mode"],
    summary:
      "PNX Sonar — Strategic Mode: focused on SERP intelligence and content strategy. Uses web search and SERP analysis to craft content plays, humanized copy and social-source-driven angles.",
    status: "available",
    sourceUrl: "https://pnx.lovable.app/chat",
  },
];

// Connectors — what's explicitly shown in the Connectors UI
export const CONNECTORS: KnowledgeRecord[] = [
  {
    id: "connector-gsc",
    type: "connector",
    name: "Google Search Console",
    aliases: ["gsc", "search console", "google search console"],
    summary:
      "Import a Search Console performance CSV to ground recommendations in real query, clicks, impressions, CTR and position data. The UI accepts a CSV export and sends a compact snapshot with each chat request.",
    status: "available",
    sourceUrl: "https://pnx.lovable.app/chat",
  },
  {
    id: "connector-youtube",
    type: "connector",
    name: "YouTube",
    aliases: ["youtube"],
    summary: "Coming soon: video SEO & tags integration (shown in the connectors roadmap UI).",
    status: "coming_soon",
    sourceUrl: "https://pnx.lovable.app/chat",
  },
  {
    id: "connector-ga4",
    type: "connector",
    name: "Google Analytics 4",
    aliases: ["ga4", "google analytics 4"],
    summary: "Coming soon: traffic & conversions integration (shown in the connectors roadmap UI).",
    status: "coming_soon",
    sourceUrl: "https://pnx.lovable.app/chat",
  },
  {
    id: "connector-blogger",
    type: "connector",
    name: "Blogger",
    aliases: ["blogger"],
    summary: "Coming soon: auto-publish drafts (shown in the connectors roadmap UI).",
    status: "coming_soon",
    sourceUrl: "https://pnx.lovable.app/chat",
  },
  {
    id: "connector-drive",
    type: "connector",
    name: "Google Drive",
    aliases: ["drive", "google drive"],
    summary: "Coming soon: export & report sync (shown in the connectors roadmap UI).",
    status: "coming_soon",
    sourceUrl: "https://pnx.lovable.app/chat",
  },
];

// Tools — derived from the MCP registry (tools declared in src/lib/mcp)
export const TOOLS: KnowledgeRecord[] = [
  {
    id: "tool-audit_page",
    type: "tool",
    name: "audit_page",
    aliases: ["audit page", "fetch_page", "audit_page"],
    summary:
      "Fetch a live URL and extract on-page SEO signals: title, meta description, H1/H2 headings, Open Graph, JSON-LD types, word count, link balance, and images.",
    status: "available",
    sourceUrl: "https://pnx.lovable.app/mcp",
  },
  {
    id: "tool-web_search",
    type: "tool",
    name: "web_search",
    aliases: ["web search", "web_search", "search"],
    summary: "Search the web for a query and return top results (title, URL, snippet). Use for competitor and SERP research.",
    status: "available",
    sourceUrl: "https://pnx.lovable.app/mcp",
  },
  {
    id: "tool-analyze_serp",
    type: "tool",
    name: "analyze_serp",
    aliases: ["analyze serp", "analyze_serp", "serp analysis"],
    summary: "Search the web for a query, then fetch the top N results and return their on-page SEO data for deep SERP analysis.",
    status: "available",
    sourceUrl: "https://pnx.lovable.app/mcp",
  },
  {
    id: "tool-image_search",
    type: "tool",
    name: "image_search",
    aliases: ["image search", "image_search"],
    summary: "Search the web for images related to a query (people, companies, products, tools, examples).",
    status: "available",
    sourceUrl: "https://pnx.lovable.app/mcp",
  },
];

// Pages — canonical public pages present in the routes
export const PAGES: KnowledgeRecord[] = [
  { id: "page-home", type: "page", name: "Home", summary: "Main landing page", status: "available", sourceUrl: "https://pnx.lovable.app/" },
  { id: "page-about", type: "page", name: "About", summary: "About PNX & the founder", status: "available", sourceUrl: "https://pnx.lovable.app/about" },
  { id: "page-chat", type: "page", name: "Chat", summary: "PNX chat interface (agent)", status: "available", sourceUrl: "https://pnx.lovable.app/chat" },
  { id: "page-blog-index", type: "page", name: "Blog", summary: "PNX blog index", status: "available", sourceUrl: "https://pnx.lovable.app/blog" },
  { id: "page-privacy", type: "page", name: "Privacy", summary: "Privacy policy", status: "available", sourceUrl: "https://pnx.lovable.app/privacy" },
  { id: "page-terms", type: "page", name: "Terms", summary: "Terms & conditions", status: "available", sourceUrl: "https://pnx.lovable.app/terms" },
];

// Blogs — imported inline from the repository's blog posts.
// We avoid importing the posts module here to keep this file self-contained
// and strictly repository-backed. Below we'll include a small, explicit
// normalized view of the highest-level blog posts present in src/lib/blog-posts.ts
export const BLOGS: KnowledgeRecord[] = [
  {
    id: "blog-free-agentic-seo-tool",
    type: "blog",
    name: "Free Agentic SEO Tool: How PNX Replaces a $200/mo SEO Stack",
    summary: "PNX is a 100% free agentic SEO tool that audits pages, researches keywords, and analyses SERPs autonomously.",
    status: "available",
    sourceUrl: "https://pnx.lovable.app/blog/free-agentic-seo-tool",
    publishedAt: "2026-05-19",
    updatedAt: "2026-05-19",
  },
  {
    id: "blog-free-ai-seo-audit-tool",
    type: "blog",
    name: "Free AI SEO Audit Tool: Run a Technical SEO Audit in 30 Seconds",
    summary: "Run a free AI SEO audit instantly. PNX checks titles, meta, schema, headings, Core Web Vitals signals and technical SEO — no signup, no limits.",
    status: "available",
    sourceUrl: "https://pnx.lovable.app/blog/free-ai-seo-audit-tool",
    publishedAt: "2026-05-19",
    updatedAt: "2026-05-19",
  },
  // Additional posts from src/lib/blog-posts.ts are intentionally omitted here for brevity.
];

// Product updates — none explicitly present in repository right now. Keep empty.
export const UPDATES: KnowledgeRecord[] = [];

export const ALL_RECORDS: KnowledgeRecord[] = [IDENTITY, ...AGENTS, ...CONNECTORS, ...TOOLS, ...PAGES, ...BLOGS, ...UPDATES];

/** Conservative matching logic for short factual queries about PNX.
 *
 * - If a clear direct match is found, returns type 'direct' with a short
 *   verified answer text (markdown) and source references.
 * - If the query requests a "list" or "latest" or needs context, returns
 *   type 'context' and a compact context snippet suitable for injection into
 *   a model prompt.
 * - If nothing verified exists, returns { type: 'notfound' }.
 */
export function queryKnowledge(raw: string):
  | { type: "direct"; text: string }
  | { type: "context"; context: string }
  | { type: "notfound" } {
  if (!raw || typeof raw !== "string") return { type: "notfound" };
  const t = raw.trim().toLowerCase();
  const clean = t.replace(/[?!.]+$/g, "").trim();

  // Exact direct identity/founder questions
  if (/who (made|built|created) pnx|who'?s the founder|who is the founder|who built pnx|saboor/.test(clean)) {
    const r = IDENTITY;
    const text = `PNX is built by **Saboor Tahir**.\n\n${r.summary}\n\nVerified source: ${r.sourceUrl}`;
    return { type: "direct", text };
  }

  // Ask for PNX identity
  if (/what is pnx|what'?s pnx|about pnx|who are you/.test(clean)) {
    const r = IDENTITY;
    const text = `PNX — ${r.summary}\n\nVerified source: ${r.sourceUrl}`;
    return { type: "direct", text };
  }

  // Agents list or specific agent
  if (/which agents|what agents|list agents|sonar/.test(clean)) {
    // If the query asks for a specific Sonar
    if (/sonar (01|1|02|2)|sonar-01|sonar-02/.test(clean)) {
      const match = /sonar (01|1)/.test(clean) || /sonar-01/.test(clean) ? AGENTS[0] : AGENTS[1];
      const text = `**${match.name}** — ${match.summary}\n\nVerified source: ${match.sourceUrl}`;
      return { type: "direct", text };
    }
    // List all agents
    const list = AGENTS.map((a) => `- **${a.name}**: ${a.summary} (source: ${a.sourceUrl})`).join("\n");
    const context = `PNX agents (verified):\n${list}`;
    return { type: "context", context };
  }

  // Connectors: available vs roadmap
  if (/which connectors|what connectors|available connectors|connectors are available/.test(clean)) {
    const available = CONNECTORS.filter((c) => c.status === "available");
    const coming = CONNECTORS.filter((c) => c.status === "coming_soon");
    const lines = [
      `Available connectors (verified):`,
      ...available.map((c) => `- **${c.name}** — ${c.summary} (source: ${c.sourceUrl})`),
      coming.length > 0 ? "" : "",
      ...(coming.length > 0 ? ["Roadmap / coming soon:", ...coming.map((c) => `- **${c.name}** — ${c.summary}`)] : []),
    ];
    return { type: "direct", text: lines.join("\n") };
  }

  // Tools
  if (/what tools|which tools|tool(s) does pnx|what (tools|features) does pnx provide/.test(clean)) {
    const list = TOOLS.map((t) => `- **${t.name}** — ${t.summary} (source: ${t.sourceUrl})`).join("\n");
    return { type: "direct", text: `PNX provides the following verified tools:\n\n${list}` };
  }

  // Pages
  if (/what pages|which pages|public pages|site pages/.test(clean)) {
    const list = PAGES.map((p) => `- **${p.name}** — ${p.sourceUrl}`).join("\n");
    return { type: "direct", text: `Public pages (canonical):\n\n${list}` };
  }

  // Latest blog
  if (/latest blog|what'?s the latest blog|latest post|most recent blog/.test(clean)) {
    // Pick the latest by publishedAt among BLOGS with valid date
    const valid = BLOGS.filter((b) => b.publishedAt).sort((a, b) => (String(b.publishedAt) > String(a.publishedAt) ? 1 : -1));
    if (valid.length === 0) return { type: "notfound" };
    const latest = valid[0];
    const text = `Latest blog (by publishedAt): **${latest.name}** — published ${latest.publishedAt}\n\n${latest.summary}\n\nRead: ${latest.sourceUrl}`;
    return { type: "direct", text };
  }

  // Product updates — none verified
  if (/latest update|product update|changelog|release/.test(clean)) {
    if (UPDATES.length === 0) return { type: "notfound" };
    const valid = UPDATES.sort((a, b) => (String(b.publishedAt ?? "") > String(a.publishedAt ?? "") ? 1 : -1));
    return { type: "context", context: `Product updates (verified):\n${valid.map((u) => `- ${u.name} — ${u.summary} (${u.publishedAt ?? "undated"})`).join("\n")}` };

  }

  // If the question mentions a specific blog slug (e.g., contains a known slug)
  for (const b of BLOGS) {
    const slug = b.sourceUrl?.split("/blog/")[1];
    if (slug && clean.includes(slug)) {
      const text = `**${b.name}** — published ${b.publishedAt}\n\n${b.summary}\n\nRead: ${b.sourceUrl}`;
      return { type: "direct", text };
    }
  }

  // Connector details (GSC explicit)
  if (/search console|google search console|gsc/.test(clean)) {
    const c = CONNECTORS.find((x) => x.id === "connector-gsc");
    if (!c) return { type: "notfound" };
    const text = `**Google Search Console** connector — ${c.summary}\n\nVerified source: ${c.sourceUrl}`;
    return { type: "direct", text };
  }

  // Conservatively decline when the query mentions PNX but we have no explicit record.
  if (/pnx|sonar|saboor|pnx seo|pnx agent|pnx tools|pnx connectors/.test(clean)) {
    return { type: "notfound" };
  }

  return { type: "notfound" };
}
