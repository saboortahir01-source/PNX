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
};

const TODAY = "2026-05-19";

const intro = (kw: string, promise: string) =>
  `**${promise}** PNX is a [free agentic SEO tool](/) built for creators, founders and SEO teams who need real answers — fast — without paying $99/month for legacy platforms. This guide breaks down everything about **${kw}** in plain English, with a comparison table, internal links to our free tools, and a one-click way to try it yourself.\n\n`;

const cta = (label: string, prompt: string) =>
  `\n\n<div class="cta-glass-wrap">\n  <a class="cta-glass" href="/chat" data-prompt="${prompt}">${label} →</a>\n</div>\n\n`;

const footer = (related: string[]) =>
  `\n\n## Keep reading\n\n${related.map((s) => `- [${s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}](/blog/${s})`).join("\n")}\n\nReady to put this into practice? [Launch PNX free](/chat) — no credit card, no daily cap, no signup wall.\n`;

export const POSTS: BlogPost[] = [
  {
    slug: "generative-engine-optimization-guide",
    title: "Generative Engine Optimization (GEO): The 2026 Beginner's Guide",
    description: "GEO is SEO for ChatGPT, Perplexity, Gemini and Google AI Overviews. Learn what it is, how it differs from SEO, and how to get your brand cited by AI.",
    keyword: "generative engine optimization",
    category: "GEO",
    readTime: "9 min",
    publishedAt: TODAY,
    updatedAt: TODAY,
    excerpt: "GEO is the new SEO — instead of blue links, you're optimising to be *cited* by ChatGPT, Perplexity, Gemini and Google AI Overviews. Here's the plain-English playbook.",
    body:
      `## What is Generative Engine Optimization (GEO)?\n\n**Generative Engine Optimization** (GEO) is the practice of shaping your content so AI answer engines — ChatGPT, Perplexity, Gemini, Claude, Google's AI Overviews, Bing Copilot — pick your brand as a source and mention you by name in their answers.\n\nTraditional SEO earns you a link on page one. GEO earns you a *sentence* inside the answer itself. When a user asks Perplexity "what's the best free SEO tool?", GEO is what gets you named in the reply.\n\n` +
      intro("generative engine optimization", "GEO isn't a replacement for SEO — it's the layer on top of it that AI answer engines actually read.") +
      `## GEO vs SEO — the honest comparison\n\n| Dimension | Classic SEO | GEO |\n|---|---|---|\n| Goal | Rank a URL on page 1 | Get cited inside an AI answer |\n| Audience | Google's crawler + humans | LLM retrievers + humans |\n| Signal that wins | Backlinks, on-page keywords, technical health | Clear factual claims, structured data, quotable stats, brand mentions |\n| Metric | Position, clicks, CTR | Mentions, citations, share-of-voice inside AI answers |\n| Feedback loop | GSC, weeks | Manual AI prompt checks, days |\n\nGEO doesn't replace SEO — an AI engine can't cite a page it can't find. But once the page is findable, GEO decides whether the AI trusts you enough to quote you.\n\n## The 6 GEO signals that actually move the needle\n\n1. **Direct, unambiguous claims.** LLMs prefer sentences that state a fact once, cleanly. "PNX is a free AI SEO tool" beats "PNX might be considered by some to be a possibly free option."\n2. **Original numbers and data.** A stat you produced (survey, benchmark, internal data) gets quoted far more than a rewritten industry stat.\n3. **Named entities.** Mention the tool, person, company, or product by exact name — not "our platform." LLMs match on entities.\n4. **Structured data.** Article, FAQ, HowTo, Product, and Organization schema tell retrievers *what kind* of answer this page is.\n5. **Being cited elsewhere.** AI models trust pages that other trusted pages already reference. Digital PR is now GEO.\n6. **Freshness and dates.** LLMs deprioritise stale content. Show a visible \`updatedAt\` and refresh evergreen posts quarterly.\n\n## A 5-step GEO workflow (do this today)\n\n1. **Pick one target question.** e.g. "best free competitor analysis tool."\n2. **Ask ChatGPT and Perplexity that question now.** Screenshot the answer. Note which brands are cited.\n3. **Reverse-engineer the sources.** Open every cited URL. What claim did the AI actually lift? Usually a clean sentence with a stat.\n4. **Publish a better sentence.** Write one paragraph that answers the question with a specific claim, a number, and your brand name. Add \`Article\` and \`FAQ\` schema.\n5. **Track weekly.** Re-ask the question every 7 days. Watch for your brand to appear.\n\n## How to check if AI already mentions you\n\n- Ask ChatGPT: *"What do you know about [brand name]?"*\n- Ask Perplexity: *"[brand name] review"* — see which sources it cites.\n- Ask Gemini: *"best [category] tools"* — count how often you're listed.\n- Google an ambiguous query and see if AI Overviews cite you.\n\nRun this monthly. It's the GEO equivalent of a rank check.\n\n## GEO for small brands\n\nYou don't need Ahrefs money. You need one clear page, one strong claim, and a handful of citations. Combine a solid [SEO audit](/blog/free-ai-seo-audit-tool) with an [AI content generator](/blog/ai-content-generator-for-seo) to publish the sentence AI wants to quote.\n` +
      cta("Optimise a Page for GEO", "Audit https://example.com and rewrite the top section so ChatGPT and Perplexity are more likely to cite it") +
      footer(["optimize-for-chatgpt-perplexity", "google-ai-overviews-seo", "geo-vs-seo-strategy"]),
    ctaLabel: "Get GEO-Ready",
    ctaPrompt: "Audit my homepage and rewrite it so AI engines are more likely to cite it",
    related: ["optimize-for-chatgpt-perplexity", "google-ai-overviews-seo", "geo-vs-seo-strategy"],
  },
  {
    slug: "optimize-for-chatgpt-perplexity",
    title: "How to Optimize Your Website for ChatGPT and Perplexity (2026)",
    description: "Practical steps to get your site cited by ChatGPT search and Perplexity. Crawlability, schema, quotable claims, and how to track AI mentions.",
    keyword: "optimize for ChatGPT",
    category: "GEO",
    readTime: "8 min",
    publishedAt: TODAY,
    updatedAt: TODAY,
    excerpt: "ChatGPT and Perplexity index the web differently than Google. Here's exactly what to change on your site to get quoted.",
    body:
      `## Why ChatGPT and Perplexity matter now\n\nMillions of people now start their research inside **ChatGPT search** or **Perplexity** instead of Google. Both engines cite sources inline — which means being cited sends real, high-intent traffic. A single sentence quoted in ChatGPT can outperform position 4 on Google.\n\n` +
      intro("optimize for ChatGPT", "You don't need to game an algorithm — you need to write the sentence the AI wants to quote.") +
      `## Step 1 — Let the crawlers in\n\nChatGPT and Perplexity have their own user agents. Blocking them means invisibility.\n\nAdd this to \`robots.txt\`:\n\n\`\`\`\nUser-agent: GPTBot\nAllow: /\n\nUser-agent: OAI-SearchBot\nAllow: /\n\nUser-agent: PerplexityBot\nAllow: /\n\nUser-agent: ChatGPT-User\nAllow: /\n\`\`\`\n\nThat's it. Don't block them "for privacy" and then wonder why you're never cited.\n\n## Step 2 — Write in claim-first paragraphs\n\nLLMs extract sentences, not pages. Every paragraph should open with the claim, then support it. Example:\n\n- **Weak:** "In today's competitive landscape, many marketers are wondering about the effectiveness of newer tools like PNX for their SEO needs..."\n- **Strong:** "PNX is a free AI SEO tool that runs page audits, keyword research, and SERP analysis in one chat. It has no daily limits and no signup."\n\nThe strong version is quotable. The weak one isn't.\n\n## Step 3 — Add the schema they actually read\n\n- **Article** on every blog post\n- **FAQPage** for question-heavy pages\n- **HowTo** for tutorials\n- **Product** for SaaS/tools\n- **Organization** on your homepage (with \`sameAs\` pointing to your socials — huge for entity recognition)\n\nRun your page through the [free SEO audit tool](/blog/free-ai-seo-audit-tool) to see what schema is missing.\n\n## Step 4 — Publish quotable stats\n\nLLMs love a number attached to a source. If your product has real data ("47% of our users publish weekly"), put it in a sentence with your brand name and a date. That sentence becomes the citation.\n\n## Step 5 — Get mentioned on trusted third-party sites\n\nAI engines trust *co-citation*. If Wired, TechCrunch, or a well-known niche blog names you next to competitors, you'll start appearing in AI answers about that category. Digital PR is now GEO work.\n\n## Step 6 — Track your mentions weekly\n\nAsk each engine the same five questions every Monday:\n\n1. "Best free [your category] tool"\n2. "Alternatives to [big competitor]"\n3. "How to [core use case]"\n4. "What is [your brand]"\n5. "[your brand] vs [competitor]"\n\nLog which engines cite you and which paragraph they quote. That's your GEO scoreboard.\n\n## The uncomfortable truth\n\nMost SEO teams still write for Google. That leaves a wide open lane in ChatGPT and Perplexity — for a few more months. Pair this guide with the [GEO fundamentals](/blog/generative-engine-optimization-guide) and start now.\n` +
      cta("Rewrite a Page for ChatGPT", "Rewrite my homepage's first section so it's more likely to be quoted by ChatGPT and Perplexity") +
      footer(["generative-engine-optimization-guide", "google-ai-overviews-seo", "llms-txt-file-guide"]),
    ctaLabel: "Optimise for AI Engines",
    ctaPrompt: "Rewrite my homepage so it's more likely to be cited by ChatGPT and Perplexity",
    related: ["generative-engine-optimization-guide", "google-ai-overviews-seo", "llms-txt-file-guide"],
  },
  {
    slug: "google-ai-overviews-seo",
    title: "Google AI Overviews SEO: How to Get Cited in the AI Answer Box",
    description: "Google AI Overviews now sit above the classic 10 blue links. Here's how they pick sources, what content wins, and how to earn a citation.",
    keyword: "Google AI Overviews SEO",
    category: "GEO",
    readTime: "9 min",
    publishedAt: TODAY,
    updatedAt: TODAY,
    excerpt: "AI Overviews eat the click before it happens. The counter-move: become the source they cite.",
    body:
      `## What Google AI Overviews actually are\n\n**Google AI Overviews** (formerly Search Generative Experience) is the AI-written summary that appears at the top of many Google search results — above the blue links, above the ads. It answers the query directly and cites 3–8 source pages you can expand.\n\nIf you're not in that source list, most users never scroll to find you.\n\n` +
      intro("Google AI Overviews SEO", "Rank 1 no longer guarantees the click. Being *cited* in the AI Overview does.") +
      `## How Google picks AI Overview sources\n\nBased on what we can measure across thousands of queries, three signals stand out:\n\n1. **You already rank in the top 10.** Overviews almost never cite a page that isn't already ranking. Classic SEO is the prerequisite.\n2. **Your page has a clean "definition" paragraph.** The first 2–3 sentences that directly answer the query — not a marketing hook.\n3. **Trust signals.** Author bylines, publisher info, structured data, and E-E-A-T markers (About page, real business address, credentials).\n\n## What earns the citation\n\n- **Definition-style opener.** Start the article with a one-paragraph, jargon-free answer.\n- **Comparison tables.** Overviews love pulling structured comparisons.\n- **Numbered lists** for "how to" queries.\n- **FAQ sections with FAQPage schema** for question queries.\n- **Original data** — surveys, benchmarks, screenshots of your own product.\n\n## What loses the citation\n\n- Long, hook-heavy intros before the answer.\n- Content that requires interaction (video, calculator) with no text alternative.\n- Pages missing basic schema.\n- Thin content (< 400 words) with no unique claim.\n- Pages with author info missing.\n\n## A page-level checklist that works\n\n- [ ] First paragraph answers the query in under 60 words\n- [ ] H1 matches search intent (not a clever headline)\n- [ ] Article + FAQPage schema present\n- [ ] Author byline with link to author page\n- [ ] At least one comparison table OR numbered list\n- [ ] Internal links to 3+ related pages\n- [ ] Updated within the last 6 months\n\nRun the page through the [free SEO audit tool](/blog/free-ai-seo-audit-tool) and it'll flag every missing item.\n\n## The zero-click problem (and the answer)\n\nYes — AI Overviews reduce clicks even when they cite you. The counter-move is *brand* clicks. Users see your logo/name inside the Overview, remember it, and come back directly. Track brand-search growth as your leading GEO metric alongside impressions.\n\n## What to do next\n\n1. Pick 5 queries you already rank position 4–15 for.\n2. Rewrite the intro of each to be a clean, definition-style answer.\n3. Add or fix schema.\n4. Watch AI Overviews cite you within 2–4 weeks.\n\nPair this with the full [GEO playbook](/blog/generative-engine-optimization-guide) for the wider AI-answer strategy.\n` +
      cta("Earn an AI Overview Citation", "Rewrite the intro of https://example.com/page so it's likely to be cited by Google AI Overviews") +
      footer(["generative-engine-optimization-guide", "optimize-for-chatgpt-perplexity", "e-e-a-t-signals-2026"]),
    ctaLabel: "Get Cited by Google AI",
    ctaPrompt: "Rewrite this page so it's more likely to be cited in Google AI Overviews",
    related: ["generative-engine-optimization-guide", "optimize-for-chatgpt-perplexity", "e-e-a-t-signals-2026"],
  },
  {
    slug: "geo-vs-seo-strategy",
    title: "GEO vs SEO in 2026: Where to Spend Your Time (and Where Not To)",
    description: "A practical split of your SEO budget between classic Google SEO and Generative Engine Optimization. What to keep, what to drop, what to add.",
    keyword: "GEO vs SEO",
    category: "GEO",
    readTime: "8 min",
    publishedAt: TODAY,
    updatedAt: TODAY,
    excerpt: "You don't need to pick between GEO and SEO. You need to know which 20% of the work now belongs to which discipline.",
    body:
      `## The false choice\n\nEvery week another LinkedIn post declares "SEO is dead, GEO is the new king." It's noise. **GEO and SEO share 80% of their DNA**: crawlable pages, clear structure, real authority. The interesting question is what changes in the remaining 20%.\n\n` +
      intro("GEO vs SEO", "Think of GEO as SEO's answer-engine layer, not its replacement.") +
      `## What still belongs to classic SEO\n\n- Technical health (Core Web Vitals, mobile UX, indexation)\n- Site architecture and internal linking\n- Backlink acquisition\n- Keyword research at scale\n- Ranking for high-intent transactional queries ("buy", "pricing", "vs")\n\nThese are still Google's game. Nothing about AI changes them.\n\n## What now belongs to GEO\n\n- Being cited in ChatGPT, Perplexity, Gemini, Claude answers\n- Winning Google AI Overviews\n- Getting your brand into AI-generated comparison lists\n- Publishing quotable claims and original stats\n- \`llms.txt\` and AI-crawler policy\n\n## Where they overlap (this is the big one)\n\n- **Content quality.** Clear, factual writing wins in both worlds.\n- **Structured data.** Article, FAQ, HowTo, Product schema helps both crawlers.\n- **Author authority.** Bylines with credentials matter for E-E-A-T and for LLM trust.\n- **Freshness.** Updated dates help both.\n\nSo 80% of your existing SEO work already builds GEO. The 20% new work is the small delta that separates cited brands from invisible ones.\n\n## A realistic 100-hour split\n\nIf you have 100 hours a month for organic:\n\n| Discipline | Hours | What to do |\n|---|---|---|\n| Classic SEO | 55 | Publish, technical fixes, backlinks |\n| Overlap (does both) | 30 | Schema, refresh evergreen content, author pages |\n| Pure GEO | 15 | AI-mention tracking, quotable rewrites, llms.txt, digital PR |\n\nStop over-investing in "GEO" as a separate discipline. Start investing in the 15 hours of unique work that actually moves the AI-citation needle.\n\n## What to stop doing\n\n- Chasing zero-volume long-tail keywords hoping AI will notice\n- Keyword-stuffing FAQ blocks\n- Spinning content with LLMs and no human edit\n- Blocking GPTBot / PerplexityBot "for safety"\n\n## Where to start this week\n\n1. Pick your 10 best-performing SEO pages.\n2. Rewrite their intro paragraph in claim-first style.\n3. Add Article + FAQ schema if missing.\n4. Ask ChatGPT and Perplexity your top 5 category queries — log who gets cited.\n5. Re-check monthly.\n\nMore in the [GEO fundamentals guide](/blog/generative-engine-optimization-guide) and the [ChatGPT & Perplexity playbook](/blog/optimize-for-chatgpt-perplexity).\n` +
      cta("Build a GEO+SEO Plan", "Give me a 30-day plan that splits my time between classic SEO and GEO for a B2B SaaS site") +
      footer(["generative-engine-optimization-guide", "optimize-for-chatgpt-perplexity", "google-ai-overviews-seo"]),
    ctaLabel: "Plan My GEO+SEO Split",
    ctaPrompt: "Build a 30-day plan splitting my time between SEO and GEO for a SaaS site",
    related: ["generative-engine-optimization-guide", "optimize-for-chatgpt-perplexity", "google-ai-overviews-seo"],
  },
  {
    slug: "llms-txt-file-guide",
    title: "llms.txt Explained: The Tiny File That Helps AI Understand Your Site",
    description: "llms.txt is a simple text file that tells LLMs what your site is about and which pages matter. Here's what to write in it and why it works.",
    keyword: "llms.txt file",
    category: "GEO",
    readTime: "6 min",
    publishedAt: TODAY,
    updatedAt: TODAY,
    excerpt: "Think of llms.txt as a robots.txt for AI answer engines — a one-page briefing on what your site is and which links matter.",
    body:
      `## What is llms.txt?\n\n**llms.txt** is a small Markdown file you place at the root of your domain (\`/llms.txt\`). It gives large language models a fast, plain-English summary of your site: what you do, what your key pages are, and which links matter most. Think of it as a curated table of contents written *for AI*.\n\n` +
      intro("llms.txt file", "It won't magically get you cited — but it removes friction between your site and every AI retriever.") +
      `## Why it exists\n\nWhen an LLM crawls a website it usually gets a soup of navigation, tracking scripts, cookie banners, and marketing copy. llms.txt cuts through that noise with a curated list of "if you only read a few pages, read these."\n\n## What to put in it\n\nA clean llms.txt has three sections:\n\n\`\`\`\n# Your Company Name\n\n> One-line description of what you do and who it's for.\n\n## Core pages\n- [Home](https://example.com/): what the product is\n- [Pricing](https://example.com/pricing): plans and cost\n- [Docs](https://example.com/docs): technical documentation\n\n## Guides\n- [Getting Started](https://example.com/blog/getting-started): 5-minute setup\n- [Advanced Use](https://example.com/blog/advanced): power-user patterns\n\n## About\n- [About us](https://example.com/about): team, mission, contact\n\`\`\`\n\nThat's it. No SEO tricks, no keyword stuffing — just accurate, useful links.\n\n## Rules that make it actually work\n\n1. **Only link to indexable, public pages.** No login walls, no paywalled content.\n2. **Descriptions are honest.** LLMs discount hype.\n3. **Keep it short.** Under 100 links. Curated beats comprehensive.\n4. **Update quarterly.** Stale entries erode trust.\n5. **Match your sitemap.** If it's in llms.txt it should also be in sitemap.xml.\n\n## Does it actually get read?\n\nSupport is still emerging. Perplexity, some model retrievers, and several AI dev tools already read it. Google and OpenAI haven't officially confirmed usage. Publish it anyway — it's a 10-minute job, it doesn't hurt SEO, and being ready when adoption hits is worth more than doing it after.\n\n## Combine with the rest of the stack\n\nllms.txt is one signal. The heavy lifting for GEO is still on-page — see the [ChatGPT & Perplexity playbook](/blog/optimize-for-chatgpt-perplexity) and [Google AI Overviews guide](/blog/google-ai-overviews-seo). Confirm your setup with the [free SEO audit tool](/blog/free-ai-seo-audit-tool).\n\n## Bonus: what NOT to do\n\n- Don't try to hide different content in llms.txt vs your visible site. LLMs check.\n- Don't list every blog post — pick your top 20.\n- Don't use it as a keyword dump.\n` +
      cta("Generate My llms.txt", "Generate a clean llms.txt for https://example.com listing my top 15 pages") +
      footer(["generative-engine-optimization-guide", "optimize-for-chatgpt-perplexity", "google-ai-overviews-seo"]),
    ctaLabel: "Write My llms.txt",
    ctaPrompt: "Generate a clean llms.txt for my site with my top pages",
    related: ["generative-engine-optimization-guide", "optimize-for-chatgpt-perplexity", "google-ai-overviews-seo"],
  },
  {
    slug: "ai-search-ranking-factors-2026",
    title: "AI Search Ranking Factors: What Actually Moves You Up in 2026",
    description: "A grounded look at the ranking factors that matter now: content depth, entity clarity, freshness, structured data, and trust signals for AI search.",
    keyword: "AI search ranking factors",
    category: "SEO",
    readTime: "10 min",
    publishedAt: TODAY,
    updatedAt: TODAY,
    excerpt: `Ignore the "200 ranking factors" myth. In 2026 there are about eight that actually matter — for both Google and AI answer engines.`,
    body:
      `## The 8 factors that really move rankings in 2026\n\nEvery year someone republishes "Google's 200 ranking factors." Most are guesswork. After analysing thousands of pages, the signals that consistently correlate with movement — across Google *and* AI answer engines — collapse into eight.\n\n` +
      intro("AI search ranking factors", "Fewer, deeper signals now beat surface-level optimisation.") +
      `## 1. Search intent match\n\nThe single biggest factor. If the SERP is dominated by tutorials and you shipped a listicle, you'll never rank — no matter your DR. Study the top 5 results before writing.\n\n## 2. Content depth (with structure)\n\n"Depth" doesn't mean 4,000 words. It means covering every subtopic a real user would ask, in a scannable order. Use H2s that mirror the questions in People Also Ask.\n\n## 3. Entity clarity\n\nAI models rank pages that clearly state *what things are*. Name your product, your competitors, your industry, and their relationships. Add \`Organization\` schema with \`sameAs\` linking to your social profiles.\n\n## 4. Structured data\n\nArticle, FAQPage, HowTo, Product, BreadcrumbList. These aren't cosmetic — they change what your page is eligible for (rich results, AI Overview citations, Perplexity source cards).\n\n## 5. Author authority (E-E-A-T)\n\nA visible author byline linking to a bio page with credentials. This has become disproportionately important for YMYL topics (health, finance, legal) and increasingly for anything AI wants to cite.\n\n## 6. Freshness\n\nAn \`updatedAt\` date within the last 12 months. Google and LLMs both discount stale content. Refresh your top 20 pages quarterly.\n\n## 7. Internal linking depth\n\nEvery important page should be reachable in ≤3 clicks from the homepage. Orphaned pages don't rank — even good ones.\n\n## 8. External trust (backlinks + brand mentions)\n\nThe old signal (backlinks) plus the new one (co-citation on trusted sites). AI engines infer authority partly from which brands appear next to you across the web.\n\n## What DOESN'T matter in 2026\n\n- Exact-match keyword density\n- Meta keywords tag (still)\n- Word count as a target\n- Hidden H1 stuffing\n- Domain age (a weak proxy at best)\n- Number of pages published\n\n## A prioritisation matrix\n\n| Factor | Impact | Effort to fix |\n|---|---|---|\n| Search intent match | Very high | Medium |\n| Content depth | High | High |\n| Entity clarity | High | Low |\n| Structured data | High | Low |\n| Author authority | Medium-high | Medium |\n| Freshness | Medium | Low (refresh existing) |\n| Internal linking | Medium | Low |\n| External trust | Very high | Very high |\n\nStart with the low-effort / high-impact ones: entity clarity, schema, and freshness. Then work through intent-match rewrites and internal links.\n\n## Run the audit\n\nUse the [free SEO audit tool](/blog/free-ai-seo-audit-tool) to score any page across these signals. Combine with a [SERP analysis](/blog/free-competitor-analysis-tool) to know what "good enough" looks like for your specific query.\n` +
      cta("Score My Page on These 8 Factors", "Audit https://example.com/page across the 8 ranking factors and rank fixes by impact vs effort") +
      footer(["free-ai-seo-audit-tool", "e-e-a-t-signals-2026", "google-ai-overviews-seo"]),
    ctaLabel: "Audit Against the 8 Factors",
    ctaPrompt: "Audit this page against the 8 modern ranking factors and prioritise fixes",
    related: ["free-ai-seo-audit-tool", "e-e-a-t-signals-2026", "google-ai-overviews-seo"],
  },
  {
    slug: "e-e-a-t-signals-2026",
    title: "E-E-A-T in 2026: Building Trust Signals That Google (and AI) Believe",
    description: "Experience, Expertise, Authoritativeness, Trust — explained without the acronym soup. Concrete on-page changes that prove your credibility.",
    keyword: "E-E-A-T signals",
    category: "SEO",
    readTime: "8 min",
    publishedAt: TODAY,
    updatedAt: TODAY,
    excerpt: "E-E-A-T isn't a ranking factor you switch on. It's the sum of small proofs — a real author, a real business, a real track record.",
    body:
      `## What E-E-A-T actually means (in plain English)\n\n**E-E-A-T** stands for *Experience, Expertise, Authoritativeness, and Trust* — Google's framework for judging whether a page deserves to be shown to a real user. It's not a single ranking factor; it's the sum of dozens of small proofs that a real person, with real credentials, at a real business, wrote this.\n\n` +
      intro("E-E-A-T signals", "Nobody ranks because they *claim* to be trustworthy. They rank because the page shows it.") +
      `## The four letters, decoded\n\n- **Experience** — you've actually used the thing you're writing about. First-person screenshots, receipts, before/after data.\n- **Expertise** — you have credentials, formal or self-taught, that qualify you to write this.\n- **Authoritativeness** — other trusted sources cite you.\n- **Trust** — the site itself is safe, transparent, and consistent (HTTPS, real contact info, clear ownership).\n\n## 12 on-page proofs of E-E-A-T\n\n1. **Author byline on every article** with a link to a full bio page.\n2. **Bio page** with photo, credentials, LinkedIn, and past work.\n3. **Publish + updated dates** visibly on the page (not just in schema).\n4. **First-person screenshots** and original photos, not stock.\n5. **Original data** — one stat you produced beats ten you rewrote.\n6. **Citations to primary sources** where you claim a fact.\n7. **An "About" page** with the founding story, team, and real location.\n8. **A "Contact" page** with a working email — not just a form.\n9. **Reviews and testimonials** with real names and links where possible.\n10. **Refund / privacy / terms** pages — not boilerplate, actually specific.\n11. **HTTPS everywhere.**\n12. **Consistent branding** across your site, LinkedIn, social profiles.\n\n## What E-E-A-T looks like in schema\n\nMinimum viable Organization schema on your homepage:\n\n\`\`\`json\n{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "Your Company",\n  "url": "https://yourcompany.com",\n  "logo": "https://yourcompany.com/logo.png",\n  "sameAs": [\n    "https://linkedin.com/company/yourcompany",\n    "https://twitter.com/yourcompany"\n  ]\n}\n\`\`\`\n\nAdd Person schema on your author bio pages with \`jobTitle\`, \`worksFor\`, \`sameAs\`.\n\n## Why AI engines care too\n\nLLMs increasingly reason about *who* published a claim. A page with clear author, publisher, and dates gets cited more often than the same claim on an anonymous page. GEO and E-E-A-T are the same fight from different angles — see the [GEO fundamentals](/blog/generative-engine-optimization-guide).\n\n## A 2-hour E-E-A-T tune-up\n\n1. Add author bylines to every existing post (30 min)\n2. Build one polished author bio page (45 min)\n3. Add Organization + Person schema (20 min)\n4. Update your About and Contact pages with real details (25 min)\n\nThat's it. Ship it, and expect rankings on YMYL-adjacent queries to move within 4–8 weeks.\n\nPair with the [AI search ranking factors guide](/blog/ai-search-ranking-factors-2026) for the full picture.\n` +
      cta("Audit My E-E-A-T Signals", "Score my site's E-E-A-T signals and tell me the 3 changes with the biggest impact") +
      footer(["ai-search-ranking-factors-2026", "google-ai-overviews-seo", "free-ai-seo-audit-tool"]),
    ctaLabel: "Score My E-E-A-T",
    ctaPrompt: "Score my site's E-E-A-T signals and prioritise fixes",
    related: ["ai-search-ranking-factors-2026", "google-ai-overviews-seo", "free-ai-seo-audit-tool"],
  },
  {
    slug: "programmatic-seo-with-ai",
    title: "Programmatic SEO with AI: How to Ship 1,000 Pages That Don't Get Penalised",
    description: "Programmatic SEO done right — with AI in the loop. Templates, data sources, quality gates, and how to avoid Google's spam penalty.",
    keyword: "programmatic SEO with AI",
    category: "SEO",
    readTime: "10 min",
    publishedAt: TODAY,
    updatedAt: TODAY,
    excerpt: `Programmatic SEO isn't dead — but the "spin 10,000 pages from a template" version is. Here's the version that still works in 2026.`,
    body:
      `## What programmatic SEO is (and isn't)\n\n**Programmatic SEO** means using a template + a dataset to publish many pages that each target a specific long-tail query. Done well, it's how sites like Zapier ("connect X to Y") or G2 ("best CRM for [industry]") own thousands of SERPs.\n\nDone badly, it's how sites get hit by Google's *scaled content abuse* update in March 2024 — and every update since.\n\n` +
      intro("programmatic SEO with AI", "The template is easy. The data and quality gates are what separate ranking pages from penalties.") +
      `## The 5 ingredients of programmatic SEO that ranks\n\n1. **A real query pattern.** People must actually search "[X] alternatives", "[Y] tutorial", "[Z] template". Verify with real search-volume data.\n2. **A rich dataset.** Each page needs *unique* information — not just a swapped keyword. Product specs, pricing, screenshots, user counts.\n3. **A strong template.** Same layout, same schema, but content slots that make each page genuinely useful.\n4. **Quality gates.** Pages that don't hit the minimum content bar don't get published.\n5. **Internal linking as first-class.** Programmatic pages must link to each other in useful clusters, not just to the homepage.\n\n## Where AI fits (and where it doesn't)\n\n**AI is great for:**\n- Generating the human-readable summary of structured data\n- Writing FAQ answers grounded in the dataset\n- Producing unique comparison text between two records\n- Suggesting internal link anchors\n\n**AI is dangerous when used to:**\n- Invent facts to fill empty template slots\n- Spin the same paragraph across 500 pages\n- Replace the dataset instead of describing it\n\nThe rule: **AI describes real data, it doesn't manufacture it.**\n\n## A safe programmatic SEO template\n\n\`\`\`\n[Product A] vs [Product B]\n----------------------------------\n1. TL;DR — one paragraph, AI-generated FROM the dataset\n2. Side-by-side spec table — pulled from dataset\n3. Where A wins — 3 bullets grounded in dataset\n4. Where B wins — 3 bullets grounded in dataset\n5. Best for — audience match, from dataset\n6. FAQ (5 Qs) — grounded in dataset with FAQ schema\n7. Related comparisons — internal links to 3 sibling pages\n\`\`\`\n\nEvery slot draws from a real column in your dataset. No slot is left to the LLM's imagination.\n\n## Quality gates before publish\n\n- **Word count floor.** Reject pages under 500 rendered words.\n- **Unique data check.** At least 3 data points must differ from any sibling page.\n- **Empty-slot detection.** Any missing field triggers a "don't publish" flag.\n- **Duplicate paragraph detection.** Any paragraph appearing on >2 pages triggers a rewrite.\n- **Manual sample review.** Read 10 random pages before shipping the batch.\n\n## Post-launch\n\nMonitor these in Search Console weekly:\n\n- Impression trend per URL group\n- Index coverage (bulk deindexing = warning)\n- Manual actions (obvious)\n\nStart small — 50 pages, not 5,000. Confirm they get indexed and earn impressions before scaling.\n\n## Combine with the wider stack\n\nStart with [AI keyword research](/blog/ai-keyword-research-free) to find the query pattern. Run the template through a [SERP analysis](/blog/free-competitor-analysis-tool) on 3 sample keywords to check intent match. Score every batch with the [free SEO audit tool](/blog/free-ai-seo-audit-tool) before publishing.\n` +
      cta("Design My Programmatic SEO Template", "Design a safe programmatic SEO template for [X] pages and list the quality gates I need") +
      footer(["ai-content-generator-for-seo", "ai-keyword-research-free", "ai-search-ranking-factors-2026"]),
    ctaLabel: "Plan Programmatic SEO",
    ctaPrompt: "Design a safe programmatic SEO template and quality gates for my site",
    related: ["ai-content-generator-for-seo", "ai-keyword-research-free", "ai-search-ranking-factors-2026"],
  },
  {
    slug: "local-seo-for-small-business",
    title: "Local SEO for Small Business: Rank in Your City Without a Big Agency",
    description: "Get your small business on Google Maps and in local AI answers. Google Business Profile, citations, reviews, and local content — all free.",
    keyword: "local SEO for small business",
    category: "SEO",
    readTime: "9 min",
    publishedAt: TODAY,
    updatedAt: TODAY,
    excerpt: "Local SEO isn't complicated. It's a checklist of small, boring things done consistently. Here's the whole list.",
    body:
      `## Local SEO in plain English\n\n**Local SEO** is how a plumber, dentist, café, or law firm gets found by people searching in their city — on Google Maps, in the local pack ("3-pack" of local results), and increasingly inside AI answers like "best coffee near me".\n\nAgencies charge $1,500/mo for this. 90% of the work is a checklist you can run yourself in a weekend.\n\n` +
      intro("local SEO for small business", "You don't need a national SEO strategy — you need to be the obvious answer in your city.") +
      `## Step 1 — Nail your Google Business Profile (GBP)\n\nThis is the single biggest lever. Log in at [google.com/business](https://google.com/business) and fill *every* field:\n\n- Exact business name (no keyword stuffing — that's a violation)\n- Precise category (primary) + up to 9 secondary categories\n- Full address, service area if applicable\n- Phone number that rings a real human\n- Website URL (with UTM to track GBP traffic)\n- Hours, including holiday hours\n- Description (750 chars, no HTML)\n- 20+ real photos: exterior, interior, team, product\n- Services / menu / products with prices where possible\n\nRe-verify quarterly. Google favours freshly-updated profiles.\n\n## Step 2 — Reviews (the ranking rocket fuel)\n\n- Ask every happy customer, in person, for a review — with a QR code shortcut\n- Reply to every review within 48 hours (yes, the negative ones too — professionally)\n- Aim for 40+ reviews with a 4.5+ average\n- Never buy reviews — Google detects and delists\n\n## Step 3 — NAP consistency\n\n**Name, Address, Phone** must be identical across every citation: your website, GBP, Yelp, Facebook, Apple Maps, industry directories, chamber of commerce. Even a "Street" vs "St." mismatch confuses Google.\n\n## Step 4 — Local citations\n\nList your business on:\n- Yelp, Bing Places, Apple Maps\n- Yellow Pages\n- Your city chamber of commerce\n- 2–3 industry-specific directories\n- Local newspaper business listings\n\nUse the *exact same* NAP everywhere.\n\n## Step 5 — Location pages on your website\n\nOne page per service area:\n\n- \`/plumber-brooklyn\`\n- \`/plumber-queens\`\n- \`/plumber-manhattan\`\n\nEach with unique content: local landmarks, neighbourhood-specific FAQs, project photos from that area. Do NOT copy-paste with the city swapped — Google penalises that.\n\nAdd \`LocalBusiness\` schema with the correct address on each page.\n\n## Step 6 — Local content\n\nPublish content only a local would write:\n\n- "Best time to fix plumbing before winter in [city]"\n- "[Neighbourhood] home renovation trends"\n- "Local building codes for [service]"\n\nThis is what earns local links from community sites and blogs — the strongest local ranking signal.\n\n## Step 7 — Local AI answers\n\nAsk ChatGPT: *"Best [your service] in [your city]"*. If you're not listed, that's your GEO gap. Fix by:\n\n- Getting mentioned on local "best of" lists (email the writers, offer to be reviewed)\n- Adding structured LocalBusiness schema\n- Ensuring your GBP is impeccable (LLMs pull heavily from it)\n\nMore on that in the [GEO fundamentals](/blog/generative-engine-optimization-guide).\n\n## What to measure\n\n- GBP profile views, direction requests, calls (weekly)\n- Local pack ranking for your top 5 keywords\n- Reviews count + average rating\n- Local organic traffic in GA4\n\nRun the whole stack through the [free SEO audit tool](/blog/free-ai-seo-audit-tool) to catch schema and on-page gaps.\n` +
      cta("Audit My Local SEO", "Audit my small business site for local SEO — GBP, schema, location pages, citations") +
      footer(["free-ai-seo-audit-tool", "e-e-a-t-signals-2026", "generative-engine-optimization-guide"]),
    ctaLabel: "Free Local SEO Audit",
    ctaPrompt: "Audit my small business for local SEO across all seven areas",
    related: ["free-ai-seo-audit-tool", "e-e-a-t-signals-2026", "generative-engine-optimization-guide"],
  },
  {
    slug: "core-web-vitals-in-2026",
    title: "Core Web Vitals in 2026: What They Really Mean for Your Rankings",
    description: "LCP, INP, CLS — explained in plain English. What each metric measures, why it matters for users and search, and how to fix the common causes.",
    keyword: "Core Web Vitals",
    category: "Technical SEO",
    readTime: "9 min",
    publishedAt: TODAY,
    updatedAt: TODAY,
    excerpt: "Core Web Vitals aren't just a ranking signal — they're the difference between a user who converts and a user who bounces.",
    body:
      `## What Core Web Vitals actually measure\n\n**Core Web Vitals** are three specific metrics Google uses to judge whether your page feels fast and stable to a real user:\n\n- **LCP (Largest Contentful Paint)** — how quickly the biggest visible element (usually the hero image or headline) appears. Target: **≤ 2.5 s**.\n- **INP (Interaction to Next Paint)** — how quickly the page responds when you tap or click. Target: **≤ 200 ms**.\n- **CLS (Cumulative Layout Shift)** — how much stuff jumps around while loading. Target: **≤ 0.1**.\n\nINP replaced FID in March 2024 — many old guides are still wrong about this.\n\n` +
      intro("Core Web Vitals", "A page that scores well feels calm, fast, and predictable. A page that scores badly feels janky — and Google notices.") +
      `## Why they matter for SEO (and revenue)\n\nCore Web Vitals are part of Google's page-experience signals. They're not the biggest ranking factor — content and links matter more — but they act as a tiebreaker on competitive queries.\n\nMore importantly: they correlate directly with bounce and conversion. A 1-second faster LCP typically lifts conversion by 5–15% on e-commerce and SaaS.\n\n## The common causes (and fixes) for each metric\n\n### LCP (loading speed)\n\n**Bad:** hero image is a 4 MB PNG, not preloaded, served from origin.\n\n**Fix:**\n- Compress to WebP/AVIF, target <150 KB above the fold\n- Preload the LCP image: \`<link rel="preload" as="image" href="/hero.avif">\`\n- Serve from a CDN\n- Remove render-blocking JS/CSS above the fold\n- Use \`fetchpriority="high"\` on the hero image\n\n### INP (interactivity)\n\n**Bad:** a big analytics script blocks the main thread when the user first taps.\n\n**Fix:**\n- Defer non-critical JS (\`defer\`, \`async\`, or load in \`requestIdleCallback\`)\n- Split large bundles with dynamic \`import()\`\n- Move heavy work off the main thread (Web Workers)\n- Remove or slim third-party scripts — the biggest single win\n\n### CLS (visual stability)\n\n**Bad:** images without dimensions push content down when they load; ads inject at page top.\n\n**Fix:**\n- Set explicit \`width\` and \`height\` (or CSS aspect-ratio) on every image and video\n- Reserve space for ads, embeds, and dynamic banners\n- Never insert content above existing content (except in response to user action)\n- Use \`font-display: swap\` with a fallback that has a similar metric\n\n## How to measure — for free\n\n1. **PageSpeed Insights** (\`pagespeed.web.dev\`) — lab + field data\n2. **Search Console → Core Web Vitals report** — real user data from Chrome\n3. **Chrome DevTools → Performance panel** — hunt long tasks locally\n4. **CrUX dashboard** — public real-user data, benchmark against competitors\n\n## A realistic 1-week fix plan\n\n- **Day 1** — Baseline every important template with PageSpeed Insights\n- **Day 2** — Compress and preload the hero image on the homepage\n- **Day 3** — Defer/remove non-critical third-party scripts\n- **Day 4** — Add \`width\`/\`height\` to every image site-wide\n- **Day 5** — Reserve space for any dynamic content\n- **Day 6** — Re-measure, iterate the biggest remaining offender\n- **Day 7** — Publish, verify in Search Console after 28 days\n\n## What NOT to obsess over\n\n- Perfect 100 lab scores (real-user data is what Google uses)\n- Microscopic gains once you're already in the "Good" band\n- Removing every third-party script (some are business-critical)\n\nCombine with the [free SEO audit tool](/blog/free-ai-seo-audit-tool) to catch the on-page issues that often cause bad CWV scores.\n` +
      cta("Fix My Core Web Vitals", "Analyse https://example.com and give me the top 5 fixes ranked by LCP/INP/CLS impact") +
      footer(["ai-search-ranking-factors-2026", "free-ai-seo-audit-tool", "e-e-a-t-signals-2026"]),
    ctaLabel: "Fix My CWV",
    ctaPrompt: "Analyse my site and give me the top 5 Core Web Vitals fixes ranked by impact",
    related: ["ai-search-ranking-factors-2026", "free-ai-seo-audit-tool", "e-e-a-t-signals-2026"],
  },
  {
    slug: "google-oauth-2-verification-explained",
    title: "Understanding Google OAuth 2.0 Verification for PNX Users",
    description: "Plain-English guide to Google OAuth 2.0 verification: what it is, why PNX is going through it, which scopes we request, and how your data stays safe.",
    keyword: "Google OAuth 2.0 verification",
    category: "Security & Trust",
    readTime: "8 min",
    publishedAt: TODAY,
    updatedAt: TODAY,
    excerpt: "Everything PNX users need to know about Google OAuth verification — scopes, Limited Use compliance, and how to revoke access.",
    body:
      `## What is Google OAuth 2.0 verification?\n\nGoogle OAuth 2.0 is the protocol that lets you grant a third-party app (like **PNX**) limited access to your Google data — your Search Console rankings, your GA4 analytics, a specific Google Sheet — *without* ever sharing your password. **Verification** is Google's review process that confirms an app actually does what it claims, and that it complies with the [Google API Services User Data Policy](https://developers.google.com/terms/api-services-user-data-policy), including **Limited Use** requirements.\n\n` +
      intro("Google OAuth 2.0 verification", "Verification = Google personally checking that PNX is safe to connect to your Google account.") +
      `## Why PNX is going through verification\n\nPNX is rolling out integrations with six Google APIs:\n\n- **Search Console** — read your aggregated search performance\n- **Google Analytics 4** — read your aggregated traffic & conversions\n- **Google Drive** — read/write only files you pick\n- **Google Sheets** — import keyword lists, export reports\n- **Blogger** — analyse and publish posts\n- **YouTube Data API v3** — read public video data for YouTube SEO\n\nSeveral of these are **sensitive or restricted scopes**, which require formal Google verification, an OAuth consent screen review, and a public demo video.\n\n## The scopes we request (and why)\n\n| API | Scope | Why we need it |\n|---|---|---|\n| Search Console | webmasters.readonly | Read-only rankings for the [free SEO audit tool](/blog/free-ai-seo-audit-tool) |\n| GA4 | analytics.readonly | Correlate SEO work with real engagement |\n| Drive | drive.file | Access only files you pick — never your full Drive |\n| Sheets | spreadsheets | Import keyword lists & export results |\n| Blogger | blogger | One-click publishing of optimised drafts |\n| YouTube Data | youtube.readonly | Power [free YouTube SEO tools](/blog/free-youtube-seo-tools) |\n\nFull breakdown: [Google OAuth & API Transparency Hub](/google-oauth-verification).\n\n## Limited Use, in plain English\n\nWhen we say PNX follows **Limited Use**, we mean four hard rules:\n\n1. We only use your Google data to power user-facing PNX features you asked for.\n2. We do not transfer it to anyone except as needed to provide that feature.\n3. We do not use it for ads.\n4. Humans don't read it — except with your explicit consent, for security investigations, or to comply with the law.\n\n## How to revoke PNX's access\n\nAt any moment, go to [myaccount.google.com/permissions](https://myaccount.google.com/permissions), find **PNX**, and click **Remove access**. We immediately lose the ability to call any Google API on your behalf — your data on Google is untouched.\n\n## What this means for you\n\n- You can connect Google to PNX with confidence knowing it's reviewed.\n- You see Google's own consent screen — we never bypass it.\n- You can disconnect any time, no email required.\n\nWant to see PNX in action before connecting Google? [Launch PNX free](/chat) — every tool works without a Google account too.\n` +
      cta("See Full Transparency Hub", "Open the Google OAuth verification hub") +
      footer(["pnx-google-search-console-seo", "free-ai-seo-audit-tool", "free-youtube-seo-tools"]),
    ctaLabel: "Read the Transparency Hub",
    ctaPrompt: "Explain how PNX uses Google OAuth to power SEO audits",
    related: ["pnx-google-search-console-seo", "free-ai-seo-audit-tool", "free-youtube-seo-tools"],
  },
  {
    slug: "pnx-google-search-console-seo",
    title: "How PNX Uses Google Search Console Data to Boost Your SEO",
    description: "PNX reads your Search Console performance (read-only) to surface ranking wins, keyword gaps and content opportunities — no PII, no storage, no daily limits.",
    keyword: "Google Search Console SEO",
    category: "Search Console",
    readTime: "7 min",
    publishedAt: TODAY,
    updatedAt: TODAY,
    excerpt: "Connect Search Console once and PNX turns raw query data into a prioritized SEO action plan — for free.",
    body:
      `## Why Search Console is the most underused SEO data source\n\nEvery site owner gets free, first-party search data from **Google Search Console (GSC)** — queries, impressions, clicks, average position. Almost nobody acts on it because the dashboard is slow and the export is ugly. PNX fixes that by reading your GSC data (read-only) and turning it into a prioritized plan.\n\n` +
      intro("Google Search Console SEO", "GSC is the only source of real Google query data for your site. PNX makes it actionable.") +
      `## What PNX accesses (and what it doesn't)\n\n- **Scope:** \`webmasters.readonly\` — read-only, nothing is changed in your account.\n- **Data:** aggregated queries, impressions, clicks, position. **No PII.**\n- **Storage:** zero. Everything is processed in memory for your request and discarded. See the full [Google OAuth & API Transparency Hub](/google-oauth-verification).\n\n## 5 things PNX does with your Search Console data\n\n1. **Striking-distance keywords** — surfaces queries ranking positions 5–15 with rising impressions. These are the fastest wins.\n2. **Content gap mapping** — pairs your top queries with the [SERP competitor analysis](/blog/free-competitor-analysis-tool) tool to show what's missing on your page.\n3. **Cannibalisation detection** — flags two URLs ranking for the same query and suggests a merge or canonical.\n4. **Lost-rankings alerts** — diffs current vs prior-period position to catch silent drops early.\n5. **Title/snippet rewriting** — combines low-CTR queries with the [AI content generator](/blog/ai-content-generator-for-seo) to ship a new title in one click.\n\n## PNX + Search Console vs paid alternatives\n\n| Capability | PNX (Free) | Ahrefs Site Explorer | Semrush Position Tracking |\n|---|---|---|---|\n| Real Google query data | ✅ (your GSC) | ❌ (modelled) | ❌ (modelled) |\n| Striking-distance report | ✅ | ✅ | ✅ |\n| Cannibalisation finder | ✅ | Limited | ✅ |\n| AI rewrite of titles | ✅ | ❌ | Add-on |\n| Price | Free | $99+/mo | $139+/mo |\n\n## How to connect (when it's available)\n\n1. Open the [PNX chat](/chat) and pick **Run Search Console Audit**.\n2. You'll see a just-in-time notice: *"PNX needs read-only access to your Search Console to analyze your rankings. We never store your data."*\n3. Click through Google's own consent screen and approve.\n4. PNX runs the audit and returns a structured plan — usually under 30 seconds.\n\n## Revoking access\n\nGo to [myaccount.google.com/permissions](https://myaccount.google.com/permissions) → PNX → **Remove access**. Done.\n\nPair this with [AI keyword research](/blog/ai-keyword-research-free) and the [free SEO audit tool](/blog/free-ai-seo-audit-tool) for a complete SEO loop.\n` +
      cta("Run a GSC-Powered Audit", "Use my Search Console data to find striking-distance keywords") +
      footer(["google-oauth-2-verification-explained", "free-ai-seo-audit-tool", "ai-keyword-research-free"]),
    ctaLabel: "Connect Search Console",
    ctaPrompt: "Use Search Console to surface my striking-distance keywords",
    related: ["google-oauth-2-verification-explained", "free-ai-seo-audit-tool", "ai-keyword-research-free"],
  },
  {
    slug: "free-agentic-seo-tool",
    title: "Free Agentic SEO Tool: How PNX Replaces a $200/mo SEO Stack",
    description: "PNX is a 100% free agentic SEO tool that audits pages, researches keywords, and analyses SERPs autonomously. See how it compares to paid tools.",
    keyword: "free agentic SEO tool",
    category: "Agentic SEO",
    readTime: "7 min",
    publishedAt: TODAY,
    updatedAt: TODAY,
    excerpt: "Agentic SEO means the AI plans, executes and reports — you just ask. Here's how PNX delivers it for free, with no daily limits.",
    body:
      `## What is an agentic SEO tool?\n\nA traditional SEO tool gives you a dashboard. An **agentic SEO tool** gives you an autonomous agent that *uses* the dashboard for you — fetching pages, parsing schema, clustering keywords, and writing the brief. PNX is the first widely available **free agentic SEO tool** with no daily limits.\n\n` +
      intro("free agentic SEO tool", "TL;DR — You don't need Ahrefs to rank in 2026.") +
      `## Why \"free\" actually matters\n\nMost \"free\" SEO tools cap you at 3 audits per day, gate keyword volume behind a paywall, or watermark exports. PNX doesn't — it runs on Lovable AI Gateway and passes that cost saving to you.\n\n## PNX vs paid alternatives\n\n| Capability | PNX (Free) | Ahrefs ($99+) | Semrush ($139+) | Surfer ($89+) |\n|---|---|---|---|---|\n| On-page SEO audit | ✅ Unlimited | ✅ | ✅ | ✅ |\n| Keyword research & clustering | ✅ AI-driven | ✅ | ✅ | Limited |\n| SERP competitor analysis | ✅ Live fetch | ✅ | ✅ | ✅ |\n| YouTube SEO | ✅ | ❌ | Limited | ❌ |\n| AI content brief | ✅ | Add-on | Add-on | ✅ |\n| Daily limits | None | Plan-based | Plan-based | Plan-based |\n| Signup required | No | Yes | Yes | Yes |\n\n## How the agent works\n\n1. You describe a goal in plain English.\n2. PNX picks the right tool — [SEO audit](/blog/free-ai-seo-audit-tool), [keyword research](/blog/ai-keyword-research-free), [SERP analysis](/blog/free-competitor-analysis-tool), or [content brief](/blog/ai-content-generator-for-seo).\n3. It fetches live data, runs the analysis, and returns a structured report you can act on today.\n\n## Who should use PNX\n\n- **Solo founders** who can't justify $1,200/yr on Ahrefs.\n- **Agencies** wanting a zero-cost second opinion alongside their existing stack.\n- **Content creators** optimising both web articles and [YouTube videos](/blog/free-youtube-seo-tools).\n- **AI-first SEOs** building workflows around an [AI SEO strategist](/blog/ai-seo-strategist-vs-traditional-seo).\n` +
      cta("Try the Free Agentic SEO Tool", "Audit my homepage and recommend the top 3 SEO improvements") +
      footer(["free-ai-seo-audit-tool", "ai-keyword-research-free", "ai-seo-strategist-vs-traditional-seo"]),
    ctaLabel: "Launch PNX — Free",
    ctaPrompt: "Run a full agentic SEO audit on https://example.com",
    related: ["free-ai-seo-audit-tool", "ai-keyword-research-free", "ai-seo-strategist-vs-traditional-seo"],
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
    excerpt: "Most audit tools take 5 minutes and 8 forms. PNX gives you a complete technical SEO audit in 30 seconds, in chat.",
    body:
      `## What a real SEO audit should cover\n\nA proper **on-page SEO audit** has four layers: metadata, structure, technical SEO, and content quality. PNX scores all four in one pass.\n\n` +
      intro("free AI SEO audit tool", "Stop pasting URLs into 6 different scanners.") +
      `## What PNX checks\n\n- **Metadata**: title tag length, meta description, canonical, robots, Open Graph & Twitter cards\n- **Headings**: H1 uniqueness, H2/H3 hierarchy, keyword presence\n- **Technical SEO**: hreflang, viewport, lang attribute, mobile-friendliness signals\n- **Structured data**: every JSON-LD schema on the page (Article, FAQ, Product, BreadcrumbList...)\n- **Content**: word count, internal vs external link ratio, images missing alt text\n\n## Free SEO audit tools — honest comparison\n\n| Tool | Free tier | AI insights | Signup | Speed |\n|---|---|---|---|---|\n| **PNX** | Unlimited | ✅ | No | <30s |\n| Ahrefs Site Audit | 1 project, 5k pages | ❌ | Yes | Slow crawl |\n| Semrush Site Audit | 100 pages/mo | ❌ | Yes | Slow crawl |\n| Screaming Frog | 500 URLs | ❌ | Yes | Desktop install |\n| Google Lighthouse | Unlimited | ❌ | No | Per-page |\n\n## How to interpret your audit\n\nPNX flags issues by severity. Fix critical metadata first (title + description + canonical), then heading structure, then schema. For the heavier lift — content quality and topical authority — pair the audit with [AI keyword research](/blog/ai-keyword-research-free) and a [content strategy brief](/blog/ai-content-generator-for-seo).\n` +
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
      `## Why AI keyword research beats traditional tools\n\nTraditional **keyword research tools** dump 10,000 phrases on you. PNX does the opposite: it picks 20 winners, clusters them by intent, and tells you which to write first.\n\n` +
      intro("AI keyword research free", "Get a 90-day editorial calendar from a single prompt.") +
      `## The PNX workflow\n\n1. **Seed** — give PNX a topic ("project management for designers")\n2. **Expand** — it generates 50–200 variations including long-tail and question keywords\n3. **Cluster** — variations are grouped by search intent (informational / commercial / transactional)\n4. **Prioritise** — clusters are scored on difficulty vs traffic potential\n5. **Brief** — every cluster gets a content brief you can hand to a writer\n\n## Free keyword research tool comparison\n\n| Tool | Free volume data | Clustering | Intent labels | Signup |\n|---|---|---|---|---|\n| **PNX** | ✅ (AI estimates) | ✅ Built-in | ✅ | No |\n| Google Keyword Planner | ✅ Ranges only | ❌ | ❌ | Ads account |\n| Ahrefs Free | 10 keywords/day | ❌ | Limited | Yes |\n| Ubersuggest | 3 searches/day | ❌ | Limited | Yes |\n| AnswerThePublic | 3 searches/day | Question only | ❌ | No |\n\n## From keywords to traffic\n\nKeywords are step one. Step two is matching the right page type — see our guide to [AI content generation for SEO](/blog/ai-content-generator-for-seo) and the [agentic SEO workflow](/blog/free-agentic-seo-tool). For video creators, the same intent logic applies to [YouTube SEO keywords](/blog/youtube-seo-keywords-guide).\n` +
      cta("Cluster Keywords Free", "Give me 30 high-intent keywords for [your topic], clustered by intent with difficulty estimates") +
      footer(["free-agentic-seo-tool", "ai-content-generator-for-seo", "youtube-seo-keywords-guide"]),
    ctaLabel: "Free Keyword Research",
    ctaPrompt: "Give me 30 high-intent keywords for project management SaaS, clustered by intent with difficulty",
    related: ["free-agentic-seo-tool", "ai-content-generator-for-seo", "youtube-seo-keywords-guide"],
  },
  {
    slug: "free-youtube-seo-tools",
    title: "Free YouTube SEO Tools: Rank Videos Without Paying VidIQ or TubeBuddy",
    description: "Free YouTube SEO tools that work. PNX is a free YouTube SEO analyzer + keyword tool + thumbnail strategist — no upgrade prompts.",
    keyword: "free YouTube SEO tools",
    category: "YouTube SEO",
    readTime: "7 min",
    publishedAt: TODAY,
    updatedAt: TODAY,
    excerpt: "VidIQ and TubeBuddy lock 80% of features behind a paywall. PNX is a free YouTube SEO analyzer that doesn't.",
    body:
      `## YouTube SEO is just SEO with different signals\n\nYouTube's algorithm cares about three things: click-through rate, watch time, and topical relevance. A good **YouTube SEO analyzer** addresses all three. PNX does it free.\n\n` +
      intro("free YouTube SEO tools", "Most \"free\" YouTube SEO tools are a 7-day trial in disguise.") +
      `## What PNX optimises\n\n- **Title**: hook-first, keyword-loaded, under 60 chars\n- **Description**: first 150 chars optimised, full timestamps, internal links\n- **Tags**: low-comp + high-intent mix derived from [YouTube SEO keywords research](/blog/youtube-seo-keywords-guide)\n- **Thumbnail strategy**: framing, emotion, contrast — based on top SERP videos\n- **Chapters**: improves average view duration and search snippets\n\n## Free YouTube SEO tools compared\n\n| Tool | Free tier | Title optimisation | Thumbnail tips | Keyword research |\n|---|---|---|---|---|\n| **PNX** | Unlimited | ✅ AI | ✅ | ✅ Free YouTube keyword research |\n| VidIQ Free | Basic stats | Limited | ❌ | 10/day |\n| TubeBuddy Free | Basic | ❌ | ❌ | 25/day |\n| YouTube Studio | Stats only | ❌ | ❌ | ❌ |\n| Keywordtool.io | Suggestions only | ❌ | ❌ | Paywalled |\n\n## A 5-step PNX workflow for new videos\n\n1. Brainstorm 5 angles with the [AI SEO strategist](/blog/ai-seo-strategist-vs-traditional-seo)\n2. Pick the winning angle with [AI keyword research](/blog/ai-keyword-research-free)\n3. Generate title + description + tags with PNX\n4. Test 2 thumbnails\n5. Re-audit after 7 days and iterate\n` +
      cta("Optimise My YouTube Video", "Optimise my YouTube video about [topic] — title, description, tags, thumbnail strategy") +
      footer(["youtube-seo-keywords-guide", "ai-keyword-research-free", "free-agentic-seo-tool"]),
    ctaLabel: "Free YouTube SEO",
    ctaPrompt: "Optimise my YouTube video about [topic] — title, description, tags, thumbnail strategy",
    related: ["youtube-seo-keywords-guide", "ai-keyword-research-free", "free-agentic-seo-tool"],
  },
  {
    slug: "youtube-seo-keywords-guide",
    title: "YouTube SEO Keywords: The 2026 Guide (Free Tool Inside)",
    description: "Find the right YouTube SEO keywords with free YouTube keyword research. Step-by-step intent matching, tag strategy, and ranking checklist.",
    keyword: "YouTube SEO keywords",
    category: "YouTube SEO",
    readTime: "9 min",
    publishedAt: TODAY,
    updatedAt: TODAY,
    excerpt: "YouTube SEO keywords aren't web SEO keywords. Here's how to research, score, and place them — free.",
    body:
      `## Web keywords vs YouTube keywords\n\nWeb searchers read. YouTube searchers watch. The intent words shift: \"how to fix\" beats \"best fix\", \"explained\" beats \"definition\", \"tutorial\" beats \"guide\". A purpose-built **YouTube SEO strategist** thinks in video intent first.\n\n` +
      intro("YouTube SEO keywords", "Stop borrowing your blog's keywords for your video titles.") +
      `## Where to place YouTube SEO keywords\n\n- **Title**: primary keyword in first 40 chars\n- **First line of description**: primary + secondary\n- **Tags**: 1 broad + 5 specific + 2 misspellings\n- **Filename of uploaded MP4**: yes, this still works\n- **Spoken in the first 30 seconds**: helps YouTube's auto-captions match\n- **Pinned comment**: 1–2 long-tail variations\n\n## How PNX finds the right keywords (free)\n\nPNX combines YouTube autosuggest, top-ranking video transcripts, and an LLM-generated intent map. Output: a list with volume estimates, difficulty estimates, and ready-to-paste tag groups.\n\n## Comparison: YouTube keyword tools\n\n| Tool | Volume | Tag suggestions | Intent | Free? |\n|---|---|---|---|---|\n| **PNX** | ✅ Estimates | ✅ Grouped | ✅ Labelled | ✅ Unlimited |\n| VidIQ | ✅ | ✅ | ❌ | Paid |\n| TubeBuddy | ✅ | ✅ | ❌ | Paid |\n| Keywordtool.io YT | ✅ | ✅ | ❌ | Paid |\n| YouTube autosuggest | ❌ | ❌ | ❌ | Free |\n\n## Next steps\n\nWith the keyword list in hand, run a full video brief using PNX as your [free YouTube SEO toolkit](/blog/free-youtube-seo-tools), or pull the same logic into your blog with [AI keyword research](/blog/ai-keyword-research-free).\n` +
      cta("Free YouTube Keyword Research", "Give me 20 YouTube SEO keywords for [your niche], grouped by video intent") +
      footer(["free-youtube-seo-tools", "ai-keyword-research-free", "ai-seo-strategist-vs-traditional-seo"]),
    ctaLabel: "Research YT Keywords",
    ctaPrompt: "Give me 20 YouTube SEO keywords for a tech review channel, grouped by intent",
    related: ["free-youtube-seo-tools", "ai-keyword-research-free", "ai-seo-strategist-vs-traditional-seo"],
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
      intro("free competitor analysis tool", "Most paid SERP analysers just show you ranks. PNX shows you why.") +
      `## What PNX compares\n\n- **SERP positions** for your target keyword (top 10 with title, URL, snippet)\n- **On-page factors** for each ranking URL: word count, headings, schema, internal links\n- **Content gaps**: which subtopics your competitors cover that you don't\n- **Backlink shape**: linking domains, anchor profile (where available)\n- **SERP features owned**: featured snippets, People Also Ask, video carousel\n\n## Comparison table\n\n| Tool | Live SERP fetch | On-page comparison | Content gaps | Free |\n|---|---|---|---|---|\n| **PNX** | ✅ | ✅ All top 10 | ✅ AI | ✅ Unlimited |\n| Ahrefs Content Gap | ✅ | Limited | ✅ | Paid |\n| Semrush Keyword Gap | ✅ | Limited | ✅ | Paid |\n| SurferSEO SERP Analyzer | ✅ | ✅ | ❌ | Paid |\n| MozBar | Limited | ❌ | ❌ | Free |\n\n## A repeatable workflow\n\n1. Run [keyword research](/blog/ai-keyword-research-free) to pick the target term\n2. Use PNX SERP analysis to fetch the top 10\n3. Audit each URL with the [free AI SEO audit tool](/blog/free-ai-seo-audit-tool)\n4. Hand the gap list to your writer (or to PNX) for [AI content generation](/blog/ai-content-generator-for-seo)\n` +
      cta("Analyse My Competitors Free", "Run a SERP analysis for 'best CRM for startups' and show me the on-page gaps") +
      footer(["free-ai-seo-audit-tool", "ai-keyword-research-free", "free-agentic-seo-tool"]),
    ctaLabel: "Free Competitor Analysis",
    ctaPrompt: "Run a SERP analysis for 'best CRM for startups' and show me on-page gaps",
    related: ["free-ai-seo-audit-tool", "ai-keyword-research-free", "free-agentic-seo-tool"],
  },
  {
    slug: "ai-content-generator-for-seo",
    title: "AI Content Generator for SEO: How to Write Pages That Rank in 2026",
    description: "Use a free AI content generator built for SEO. PNX writes briefs, outlines, and full drafts that match search intent and rank.",
    keyword: "AI content generator for SEO",
    category: "AI Content",
    readTime: "8 min",
    publishedAt: TODAY,
    updatedAt: TODAY,
    excerpt: "Generic AI writing tools produce generic content. SEO-aware AI content generation is a different sport.",
    body:
      `## Why \"just use ChatGPT\" doesn't rank\n\nGeneric LLM output lacks the three things Google rewards: original perspective, structural depth, and intent match. An **AI content generator for SEO** has to fix all three.\n\n` +
      intro("AI content generator for SEO", "Ranking content isn't about more words — it's about the right structure.") +
      `## What PNX does differently\n\n- Pulls live SERP context before drafting (see [SERP analysis](/blog/free-competitor-analysis-tool))\n- Matches the dominant content type (listicle / how-to / comparison / glossary)\n- Auto-generates FAQ schema for People Also Ask coverage\n- Adds internal link suggestions inside the draft\n- Outputs a brief AND a draft — your call which to ship\n\n## Comparison: AI content tools for SEO\n\n| Tool | SERP-aware | Schema output | Internal links | Free |\n|---|---|---|---|---|\n| **PNX** | ✅ | ✅ | ✅ | ✅ Unlimited |\n| SurferSEO AI | ✅ | ❌ | ❌ | Paid |\n| Jasper | Optional | ❌ | ❌ | Paid |\n| ChatGPT | ❌ | If prompted | ❌ | Limited |\n| Copy.ai | ❌ | ❌ | ❌ | Limited free |\n\n## The PNX content workflow\n\n1. Start with [keyword research](/blog/ai-keyword-research-free)\n2. Run a [SERP analysis](/blog/free-competitor-analysis-tool) on the winning keyword\n3. Ask PNX for an outline, then a draft\n4. Edit for voice (your job), publish, and re-audit with the [SEO audit tool](/blog/free-ai-seo-audit-tool)\n` +
      cta("Generate an SEO-Ready Brief", "Write an SEO-optimised article brief for 'best note-taking apps' targeting US searchers") +
      footer(["free-agentic-seo-tool", "ai-keyword-research-free", "ai-seo-strategist-vs-traditional-seo"]),
    ctaLabel: "Generate SEO Content",
    ctaPrompt: "Write an SEO-optimised article brief for 'best note-taking apps' targeting US searchers",
    related: ["free-agentic-seo-tool", "ai-keyword-research-free", "ai-seo-strategist-vs-traditional-seo"],
  },
  {
    slug: "ai-seo-strategist-vs-traditional-seo",
    title: "AI SEO Strategist vs Traditional SEO: What Changes in 2026",
    description: "AI SEO strategists outperform traditional workflows on speed and intent matching. Here's where they win, where they don't, and how to combine both.",
    keyword: "AI SEO strategist",
    category: "Agentic SEO",
    readTime: "9 min",
    publishedAt: TODAY,
    updatedAt: TODAY,
    excerpt: "An AI SEO strategist isn't a chatbot that gives advice. It's an agent that runs the whole workflow — research, brief, draft, audit.",
    body:
      `## What an AI SEO strategist actually does\n\nAn **AI SEO strategist** doesn't just answer questions. It plans the project, calls the tools, and ships the deliverable: keyword cluster, content brief, on-page audit, internal link plan, SERP gap report. PNX is built around this loop.\n\n` +
      intro("AI SEO strategist", "Old SEO: 8 tools, 6 tabs, 4 hours. New SEO: one chat, 4 minutes.") +
      `## Where AI strategists win\n\n- **Speed**: minutes instead of hours\n- **Intent matching**: LLMs are better than humans at classifying search intent at scale\n- **Briefs**: structured, repeatable, SERP-aware\n- **Iteration**: instant re-audit after a change\n\n## Where traditional SEO still wins\n\n- **Backlink outreach** (relationship-driven)\n- **Brand-led PR**\n- **Original research and primary data**\n- **Technical SEO on huge sites** (millions of URLs — still needs dedicated crawlers)\n\n## Side-by-side\n\n| Workflow stage | Traditional SEO | AI SEO Strategist (PNX) |\n|---|---|---|\n| Keyword research | 60–90 min in Ahrefs | 5 min in chat |\n| SERP analysis | Manual top-10 tabs | Live fetch + parsed |\n| Content brief | Templated doc | SERP-aware in seconds |\n| On-page audit | Screaming Frog | 30-second audit |\n| Reporting | Looker Studio | Inline summary |\n| Cost | $200–$2000/mo | Free |\n\n## The hybrid that wins\n\nUse a traditional crawler for site-wide tech audits. Use PNX as your **AI SEO strategist** for every page-level decision — [keyword research](/blog/ai-keyword-research-free), [SERP gap analysis](/blog/free-competitor-analysis-tool), [content generation](/blog/ai-content-generator-for-seo), and [video SEO](/blog/free-youtube-seo-tools).\n` +
      cta("Hire Your AI SEO Strategist", "Act as my AI SEO strategist for a B2B SaaS launch — give me a 30-day plan") +
      footer(["free-agentic-seo-tool", "ai-content-generator-for-seo", "free-ai-seo-audit-tool"]),
    ctaLabel: "Get Your AI SEO Strategist",
    ctaPrompt: "Act as my AI SEO strategist for a B2B SaaS launch — give me a 30-day plan",
    related: ["free-agentic-seo-tool", "ai-content-generator-for-seo", "free-ai-seo-audit-tool"],
  },
];

export const getPost = (slug: string) => POSTS.find((p) => p.slug === slug);
export const allSlugs = () => POSTS.map((p) => p.slug);
