export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  keyword: string;
  category: string;
  readTime: string;
  publishedAt: string;
  updatedAt: string;
  excerpt: string;
  body: string; // markdown
  ctaLabel: string;
  ctaPrompt: string;
  related: string[]; // slugs
  faqs?: { q: string; a: string }[];
};

const TODAY = "2026-05-19";

const intro = (kw: string, promise: string) =>
  `**${promise}** PNX is a free agentic SEO tool built for creators, founders and SEO teams who need real answers — fast. This guide breaks down everything about **${kw}** in plain English, with practical steps and a one-click way to try it yourself.\n\n`;

const cta = (label: string, prompt: string) =>
  `\n\n<div class="cta-glass-wrap">\n  <a class="cta-glass" href="/chat" data-prompt="${prompt}">${label} →</a>\n</div>\n\n`;

const footer = (related: string[]) =>
  `\n\n## Keep reading\n\n${related.map((s) => `- [${s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}](/blog/${s})`).join("\n")}\n\nReady to put this into practice? [Launch PNX free](/chat) — no credit card, no daily cap.\n`;

export const POSTS: BlogPost[] = [
  {
    slug: "free-agentic-seo-tool",
    title: "Free Agentic SEO Tool: How PNX Replaces a $200/mo SEO Stack",
    description: "PNX is a 100% free agentic SEO tool that audits pages, researches keywords, and analyses SERPs autonomously.",
    keyword: "free agentic SEO tool",
    category: "Agentic SEO",
    readTime: "7 min",
    publishedAt: TODAY,
    updatedAt: TODAY,
    excerpt: "Agentic SEO means the AI plans, executes and reports — you just ask. Here's how PNX delivers it for free.",
    body:
      `## What is an agentic SEO tool?\n\nA traditional SEO tool gives you a dashboard. An **agentic SEO tool** gives you an autonomous agent that *uses* the dashboard for you — fetching pages, parsing schema, clustering keywords, and writing the brief. PNX is a free agentic SEO tool built for practical workflows.\n\n` +
      intro("free agentic SEO tool", "TL;DR — You don't need Ahrefs to rank in 2026.") +
      `## Why \"free\" actually matters\n\nMost \"free\" SEO tools cap usage or hide key features behind paywalls. PNX aims to be straightforward and usable without friction.\n\n## How the agent works\n\n1. You describe a goal in plain English.\n2. PNX picks the right tool and runs it live.\n3. It fetches data, runs the analysis, and returns a structured, actionable report.\n\n` +
      cta("Try PNX Free", "Audit https://example.com and show me high-priority SEO recommendations") +
      footer(["free-ai-seo-audit-tool", "ai-keyword-research-free", "free-competitor-analysis-tool"]),
    ctaLabel: "Launch PNX — Free",
    ctaPrompt: "Run a full agentic SEO audit on https://example.com",
    related: ["free-ai-seo-audit-tool", "ai-keyword-research-free", "free-competitor-analysis-tool"],
  },
  {
    slug: "free-ai-seo-audit-tool",
    title: "Free AI SEO Audit Tool: Run a Technical SEO Audit in 30 Seconds",
    description: "Run a free AI SEO audit instantly. PNX checks titles, meta, schema, headings, Core Web Vitals signals and technical SEO — no signup, no limits.",
    keyword: "free AI SEO audit tool",
    category: "On-Page SEO",
    readTime: "6 min",
    publishedAt: TODAY,
    updatedAt: TODAY,
    excerpt: "Most audit tools take minutes and forms. PNX gives you a complete technical SEO audit in 30 seconds, in chat.",
    body:
      `## What a real SEO audit should cover\n\nA proper **on-page SEO audit** has four layers: metadata, structure, technical SEO, and content quality. PNX scores all four in one pass.\n\n` +
      intro("free AI SEO audit tool", "Stop pasting URLs into multiple scanners.") +
      `## What PNX checks\n\n- **Metadata**: title tag, meta description, canonical, robots, Open Graph\n- **Headings**: H1 uniqueness, H2/H3 hierarchy\n- **Technical SEO**: viewport, lang, internal/external links\n- **Structured data**: JSON-LD types found on the page\n- **Content**: word count, images missing alt text\n\n` +
      cta("Run a Free SEO Audit Now", "Audit https://example.com and list every issue grouped by priority") +
      footer(["free-agentic-seo-tool", "ai-keyword-research-free", "free-competitor-analysis-tool"]),
    ctaLabel: "Run Free SEO Audit",
    ctaPrompt: "Audit https://example.com and list every issue grouped by priority",
    related: ["free-agentic-seo-tool", "ai-keyword-research-free", "free-competitor-analysis-tool"],
  },
  {
    slug: "ai-keyword-research-free",
    title: "AI Keyword Research, Free: Cluster & Score Keywords in Minutes",
    description: "Free AI keyword research tool. Get search intent, clusters, question variations and difficulty estimates without paying for Ahrefs or Semrush.",
    keyword: "AI keyword research free",
    category: "Keyword Research",
    readTime: "8 min",
    publishedAt: TODAY,
    updatedAt: TODAY,
    excerpt: "AI keyword research isn't about more keywords. It's about better clusters, sharper intent, and a path to page one.",
    body:
      `## Why AI keyword research beats traditional tools\n\nTraditional keyword tools dump long lists. PNX picks winners, clusters them by intent, and tells you which to write first.\n\n` +
      intro("AI keyword research free", "Get a short list of high-potential keywords and content directions.") +
      `## The PNX workflow\n\n1. Seed with a topic\n2. Expand to variations\n3. Cluster by intent\n4. Prioritise by difficulty vs opportunity\n5. Produce briefs\n\n` +
      cta("Cluster Keywords Free", "Give me 30 high-intent keywords for project management SaaS, clustered by intent with difficulty") +
      footer(["free-ai-seo-audit-tool", "ai-content-generator-for-seo", "youtube-seo-keywords-guide"]),
    ctaLabel: "Free Keyword Research",
    ctaPrompt: "Give me 30 high-intent keywords for project management SaaS, clustered by intent",
    related: ["free-ai-seo-audit-tool", "ai-content-generator-for-seo", "youtube-seo-keywords-guide"],
  },
  {
    slug: "free-competitor-analysis-tool",
    title: "Free Competitor Analysis Tool for SEO: SERP + On-Page Side-by-Side",
    description: "Free SEO competitor analysis. PNX runs live SERP analysis, compares on-page factors, and shows exactly how to outrank your competitors.",
    keyword: "free competitor analysis tool",
    category: "SERP Analysis",
    readTime: "8 min",
    publishedAt: TODAY,
    updatedAt: TODAY,
    excerpt: "Knowing who ranks is easy. Knowing why they rank — and how to take their spot — is what wins SEO.",
    body:
      `## SEO competitor analysis in 3 layers\n\nA proper **SEO competitor analysis** answers: who ranks, what they did, and what gap you can exploit. PNX runs all three live.\n\n` +
      intro("free competitor analysis tool", "Most paid SERP analysers just show you ranks. PNX helps you act on the differences.") +
      cta("Run a Competitor Analysis", "Compare my page with the top 5 results for my target query") +
      footer(["free-ai-seo-audit-tool", "ai-keyword-research-free", "free-agentic-seo-tool"]),
    ctaLabel: "Compare Top Results",
    ctaPrompt: "Compare https://example.com with the top 5 results for 'best project management tool'",
    related: ["free-ai-seo-audit-tool", "ai-keyword-research-free", "free-agentic-seo-tool"],
  },
  {
    slug: "free-youtube-seo-tools",
    title: "Free YouTube SEO Tools: Rank Videos Without Paying VidIQ or TubeBuddy",
    description: "Free YouTube SEO tools that work. PNX is a free YouTube SEO analyzer + keyword tool + thumbnail strategist.",
    keyword: "free YouTube SEO tools",
    category: "YouTube SEO",
    readTime: "7 min",
    publishedAt: TODAY,
    updatedAt: TODAY,
    excerpt: "VidIQ and TubeBuddy lock many features behind paywalls. PNX offers practical YouTube SEO help for free.",
    body:
      `## YouTube SEO is just SEO with different signals\n\nYouTube's algorithm cares about click-through rate, watch time, and topical relevance. PNX addresses these factors with actionable suggestions.\n\n` +
      intro("free YouTube SEO tools", "Optimize titles, descriptions, tags and thumbnails for real watch-time gains.") +
      cta("Optimise My YouTube Video", "Optimise my YouTube video about [topic] — title, description, tags, thumbnail strategy") +
      footer(["youtube-seo-keywords-guide", "ai-keyword-research-free", "free-agentic-seo-tool"]),
    ctaLabel: "Free YouTube SEO",
    ctaPrompt: "Optimise my YouTube video about [topic] — title, description, tags, thumbnail strategy",
    related: ["youtube-seo-keywords-guide", "ai-keyword-research-free", "free-agentic-seo-tool"],
  },
  {
    slug: "generative-engine-optimization-guide",
    title: "Generative Engine Optimization (GEO): The 2026 Beginner's Guide",
    description: "GEO is SEO for ChatGPT, Perplexity, Gemini and Google AI Overviews. Learn what it is, how it differs from SEO, and how to get your brand cited by AI.",
    keyword: "generative engine optimization",
    category: "GEO",
    readTime: "9 min",
    publishedAt: TODAY,
    updatedAt: TODAY,
    excerpt: "GEO is the new SEO — instead of blue links, you're optimising to be cited by AI. This guide explains practical steps.",
    body:
      `## What is Generative Engine Optimization (GEO)?\n\nGEO is the practice of shaping your content so AI answer engines — ChatGPT, Perplexity, Gemini, and Google's AI Overviews — pick your brand as a source and mention you in answers.\n\n` +
      intro("generative engine optimization", "GEO adds an AI-answer layer on top of classic SEO.") +
      cta("Optimise a Page for GEO", "Audit https://example.com and rewrite the top section to be more likely quoted by AI") +
      footer(["optimize-for-chatgpt-perplexity", "google-ai-overviews-seo", "geo-vs-seo-strategy"]),
    ctaLabel: "Get GEO-Ready",
    ctaPrompt: "Audit my homepage and rewrite it so AI engines are more likely to cite it",
    related: ["optimize-for-chatgpt-perplexity", "google-ai-overviews-seo", "geo-vs-seo-strategy"],
  },
  // Keep other high-quality posts as needed. Removed incomplete/placeholder posts.
];

export const getPost = (slug: string) => POSTS.find((p) => p.slug === slug);
export const allSlugs = () => POSTS.map((p) => p.slug);